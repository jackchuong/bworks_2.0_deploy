import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlutusTxDto } from './dto/create.dto';
import { UpdatePlutusTxDto } from './dto/update.dto';
import { PlutusTx, PlutusTxDocument } from './schemas/schema';
import { RaList, MongooseQuery } from '../flatworks/types/types';
import { JobBidService } from '../jobbid/service';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { EventsService } from '../events/service';

import {
  plutusDashboardScript,
  plutusScript,
  plutusMonthlyScript,
} from '../flatworks/dbcripts/aggregate.scripts';
import * as moment from 'moment';

@Injectable()
export class PlutusTxService {
  constructor(
    @InjectModel(PlutusTx.name) private readonly model: Model<PlutusTxDocument>,
    private jobBidService: JobBidService,
    private mailService: MailService,
    private userService: UserService,
    private eventsService: EventsService,
  ) {}

  async getMonthlyPlutusTxsReport(queryType, userId): Promise<any> {
    const toDate = moment().toDate();
    const fromDate = moment().subtract(1, 'year').toDate();

    const months = [];
    for (let i = 0; i < 12; i++) {
      const month = moment().subtract(i, 'month').format('M-YYYY').toString();
      const shortYear = moment()
        .subtract(i, 'month')
        .format('MM-YY')
        .toString();
      const date = moment().subtract(i, 'month').toDate();
      months.push({ _id: month, shortYear, date });
    }

    const aggregateScript = plutusMonthlyScript(
      queryType,
      userId,
      fromDate,
      toDate,
    );
    const _result = await this.model.aggregate(aggregateScript);

    const emptyRecord = {
      _id: '',
      date: '',
      sumLockedAmounts: 0,
      numberOfLockTxs: 0,
      sumUnlockedAmounts: 0,
      numberOfUnlockedTxs: 0,
    };

    const result = months.map((item) => {
      const jobItem = _result.find((jobItem) => jobItem._id == item._id);
      if (jobItem) {
        return { ...jobItem, shortYear: item.shortYear };
      }

      return { ...emptyRecord, ...item };
    });

    return result.reverse();
  }

  //count for global app search
  async count(filter): Promise<any> {
    return await this.model.find(filter).count().exec();
  }

  async getPlutusReports(queryType: string, userId: string): Promise<any> {
    const aggregateScript = plutusScript(queryType, userId);
    const result = await this.model.aggregate(aggregateScript);
    if (result && result.length) {
      return result[0];
    }

    return {};
  }

  async getPlutusDashboard(): Promise<any> {
    const toDate = moment().toDate();
    const fromDate = moment().subtract(1, 'year').toDate();

    const months = [];
    for (let i = 0; i < 12; i++) {
      const month = moment().subtract(i, 'month').format('M-YYYY').toString();
      const shortYear = moment()
        .subtract(i, 'month')
        .format('MM-YY')
        .toString();
      const date = moment().subtract(i, 'month').toDate();
      months.push({ _id: month, shortYear, date });
    }
    const aggregateScript = plutusDashboardScript(fromDate, toDate);
    const _result = await this.model.aggregate(aggregateScript);

    const emptyRecord = {
      _id: '',
      date: '',
      sumLockedAmounts: 0,
      numberOfLockTxs: 0,
      sumUnlockedAmounts: 0,
      numberOfUnlockedTxs: 0,
    };

    const result = months.map((item) => {
      const jobItem = _result.find((jobItem) => jobItem._id == item._id);
      if (jobItem) {
        return { ...jobItem, shortYear: item.shortYear };
      }

      return { ...emptyRecord, ...item };
    });
    return result.reverse();
  }

  async findAll(query: MongooseQuery): Promise<RaList> {
    const count = await this.model.find(query.filter).count().exec();
    const data = await this.model
      .find(query.filter)
      .sort(query.sort)
      .skip(query.skip)
      .limit(query.limit)
      .exec();

    return { count: count, data: data };
  }

  async findOne(id: string): Promise<PlutusTx> {
    return await this.model.findById(id).exec();
  }

  async create(createPlutusTxDto: CreatePlutusTxDto): Promise<PlutusTx> {
    //notify email
    const employer = await this.userService.findById(createPlutusTxDto.empId);
    const jobSeeker = await this.userService.findById(createPlutusTxDto.jskId);

    if (createPlutusTxDto.lockedTxHash && createPlutusTxDto.jobBidId) {
      this.mailService.paymentUpdate(
        createPlutusTxDto,
        jobSeeker,
        employer,
        true,
      );
    }

    let result;
    try {
      result = await new this.model({
        ...createPlutusTxDto,
        createdAt: new Date(),
      }).save();

      //update jobBid
      this.jobBidService.updateByBackgroundJob(result.jobBidId, {
        plutusTxId: result._id.toString(),
      });

      //event notify to job seeker & trusted partner
      this.eventsService.addEvent(jobSeeker._id.toString(), 'notification', {
        type: 'payment',
        message: result._id.toString(),
        userType: 'jobSeeker',
      });

      this.eventsService.addEvent(result.unlockUserId, 'notification', {
        type: 'payment',
        message: result._id.toString(),
        userType: 'trustedPartner',
      });
    } catch (error) {
      throw new BadRequestException('Can not insert plutusTx record');
    }

    return result;
  }

  async update(
    id: string,
    updatePlutusTxDto: UpdatePlutusTxDto,
    userId?: string,
  ): Promise<PlutusTx> {
    //update jobBid isPaid if the transaction is signed by right unlockUserId from browser
    const currentRecord = (await this.findOne(id)) as any;
    if (
      updatePlutusTxDto.unlockedTxHash &&
      userId === currentRecord.unlockUserId
    ) {
      this.jobBidService.updateByBackgroundJob(currentRecord.jobBidId, {
        isPaid: true,
        completedAt: new Date(),
      });

      //email notify employer & job seeker
      const employer = await this.userService.findById(currentRecord.empId);
      const jobSeeker = await this.userService.findById(currentRecord.jskId);
      this.mailService.paymentUpdate(
        {
          ...currentRecord._doc,
          unlockedTxHash: updatePlutusTxDto.unlockedTxHash,
        },
        jobSeeker,
        employer,
        false,
      );

      //event notify to job seeker & employer
      this.eventsService.addEvent(jobSeeker._id.toString(), 'notification', {
        type: 'payment',
        message: currentRecord._id.toString(),
        userType: 'jobSeeker',
      });

      this.eventsService.addEvent(employer._id.toString(), 'notification', {
        type: 'payment',
        message: currentRecord._id.toString(),
        userType: 'employer',
      });
    }

    return await this.model.findByIdAndUpdate(id, updatePlutusTxDto).exec();
  }

  async findByScriptTxHashAndUpdate(
    scriptTxHash: string,
    updatePlutusTxDto: UpdatePlutusTxDto,
  ): Promise<PlutusTx> {
    return await this.model
      .findOneAndUpdate({ lockedTxHash: scriptTxHash }, updatePlutusTxDto)
      .exec();
  }

  async delete(id: string): Promise<PlutusTx> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}

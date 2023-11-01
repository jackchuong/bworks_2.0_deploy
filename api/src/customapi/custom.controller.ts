import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Response,
  Query,
  UseGuards,
  Req,
  Request,
} from '@nestjs/common';
import { PublicService } from './public.service';
import { PlutusTxService } from '../plutustx/service';
import * as moment from 'moment';
import { PostJobService } from '../postjob/service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as lodash from 'lodash';
import { queryTransform } from '../flatworks/utils/getlist';

@Controller('customapis')
export class CustomController {
  constructor(
    private readonly plutusTxService: PlutusTxService,
    private readonly postJobService: PostJobService,
    private readonly publicService: PublicService,
  ) {}

  //dashboard apis
  @Get('dashboardcards')
  async getDashboardData(@Response() res: any) {
    const result = await this.publicService.getDashboardData();
    return res.json(result);
  }

  //plutus dashboard chart
  @Get('dashboardplutus')
  async _getDashboardPlutus(@Response() res: any) {
    const result = await this.plutusTxService.getPlutusDashboard();
    return res.json(result);
  }
  //job dashboard chart
  @Get('jobdashboard')
  async _getDashboardJob(@Response() res: any) {
    const result = await this.postJobService.getJobDashboard();
    return res.json(result);
  }

  //current user, jobs statistic
  @Get('userstatistic')
  async getDashboardUserStatistic(@Response() res: any, @Request() req) {
    const userId = req.user.userId;
    const result = await this.publicService.getDashboardUserStatistic(userId);
    return res.json(result);
  }

  //current user, jobs statistic by userId {filter: {userId: abc}}
  @Get('userprofile')
  async userStatistic(@Response() res: any, @Query() query) {
    const mongooseQuery = queryTransform(query);
    const result = await this.publicService.getDashboardUserStatistic(
      mongooseQuery.filter.userId,
    );
    return res.json(result);
  }

  //get userId from access token
  @Get('userid')
  async getUserId(@Response() res: any, @Req() request) {
    const userId = lodash.get(request, 'user.userId', null);
    return res.json(userId);
  }

  //plutus report
  @Get('plutusreports')
  async getDashboardPlutus(
    @Response() res: any,
    @Req() request,
    @Query() query,
  ) {
    const userId = lodash.get(request, 'user.userId', null);
    const mongooseQuery = queryTransform(query);
    const queryType = mongooseQuery.filter.queryType;

    //if queryType = emp return plutus txs that locked by emp, if queryType = jsk return plutus txs bid by jsk, if queryType = cms return all plutus txs
    if (!userId || !queryType) {
      return res.json({});
    }
    const result = await this.plutusTxService.getPlutusReports(
      queryType,
      userId,
    );
    return res.json(result);
  }

  //job report
  @Get('jobreports')
  async getDashboardJob(@Response() res: any, @Req() request, @Query() query) {
    const userId = lodash.get(request, 'user.userId', null);
    const mongooseQuery = queryTransform(query);
    const queryType = mongooseQuery.filter.queryType;

    //if queryType = emp return job data posted by emp, if queryType = jsk return job data bid by emp by jsk, if queryType = cms return all job data
    if (!userId || !queryType) {
      return res.json({});
    }
    const result = await this.postJobService.getJobReports(queryType, userId);
    return res.json(result);
  }

  //job list report by emp, jsk or cms(all)
  @Get('getmonthlyjobreport')
  async getMonthlyJobReport(
    @Response() res: any,
    @Req() request,
    @Query() query,
  ) {
    const userId = lodash.get(request, 'user.userId', null);
    const mongooseQuery = queryTransform(query);
    const queryType = mongooseQuery.filter.queryType;

    //if queryType = emp return job data posted by emp, if queryType = jsk return job data bid by emp by jsk, if queryType = cms return all job data
    if (!userId || !queryType) {
      return res.json({});
    }
    const result = await this.postJobService.getMonthlyJobReport(
      queryType,
      userId,
    );
    return res.json(result);
  }

  //job list report by emp, jsk or cms(all)
  @Get('getmonthlyplutustxsreport')
  async getMonthlyPlutusTxsReport(
    @Response() res: any,
    @Req() request,
    @Query() query,
  ) {
    const userId = lodash.get(request, 'user.userId', null);
    const mongooseQuery = queryTransform(query);
    const queryType = mongooseQuery.filter.queryType;

    //if queryType = emp return job data posted by emp, if queryType = jsk return job data bid by emp by jsk, if queryType = cms return all job data
    if (!userId || !queryType) {
      return res.json({});
    }
    const result = await this.plutusTxService.getMonthlyPlutusTxsReport(
      queryType,
      userId,
    );
    return res.json(result);
  }
}

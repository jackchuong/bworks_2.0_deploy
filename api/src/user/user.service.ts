import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { RaList, MongooseQuery } from '../flatworks/types/types';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}

  async findAll(): Promise<any[]> {
    return this.model.find().exec();
  }

  //for rest endpoint remove password & refresh token before return
  async findAllList(query: MongooseQuery): Promise<RaList> {
    const count = await this.model.find(query.filter).count().exec();
    const data = await this.model
      .find(query.filter)
      .sort(query.sort)
      .skip(query.skip)
      .limit(query.limit)
      .select({ password: 0, refreshToken: 0 })
      .exec();
    return { count: count, data: data };
  }

  async findAllRaw(filter = {}, select = {}): Promise<User[]> {
    return this.model.find(filter).select(select).exec();
  }

  async findById(id: string): Promise<any> {
    return await this.model.findById(id).exec();
  }

  //for rest endpoint remove password & refresh token before return
  async findByIdForRest(id: string): Promise<any> {
    return await this.model
      .findById(id)
      .select({ password: 0, refreshToken: 0 })
      .exec();
  }

  async findOne(username: string): Promise<User> {
    const [user] = await this.model.find({ username: username }).exec();
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const username = createUserDto.username.toLowerCase();
    //roles is always ['user'] as created time
    const roles = ['user'];
    const saltOrRounds = 10;
    const password = await bcrypt.hash(createUserDto.password, saltOrRounds);

    return await new this.model({
      ...createUserDto,
      username,
      password,
      roles,
      createdAt: new Date(),
    }).save();
  }

  async updatePassword(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if (!updateUserDto.password) {
      return;
    }
    let _updateUserDto = updateUserDto;
    //don't update roles
    delete _updateUserDto['roles'];
    if (updateUserDto.password) {
      const saltOrRounds = 10;
      const password = await bcrypt.hash(updateUserDto.password, saltOrRounds);
      _updateUserDto = { ...updateUserDto, password };
    }
    return await this.model.findByIdAndUpdate(id, _updateUserDto).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    //don't update roles & password
    delete updateUserDto['roles'];
    delete updateUserDto['password'];

    return await this.model.findByIdAndUpdate(id, updateUserDto).exec();
  }

  async delete(id: string): Promise<User> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}

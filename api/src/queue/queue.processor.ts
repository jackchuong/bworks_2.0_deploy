import {
  Process,
  Processor,
  OnQueueActive,
  OnQueueCompleted,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { exec } from 'child_process';
import { CreateWallet } from '../flatworks/utils/cardano';
import { AccountLanguagesForUser } from '../flatworks/utils/github';

@Processor('queue')
export class QueueProcessor {
  private readonly logger = new Logger(QueueProcessor.name);

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job) {
    console.log(
      `Completed job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @Process('createWallet')
  createWallet(job: Job) {
    CreateWallet(job.data.userId);
  }

  @Process('analyzeGit')
  analyzeGit(job: Job) {
    AccountLanguagesForUser(job.data.gitLink, job.data.userId);
  }

  @Process('execShell')
  execShell(job: Job) {
    exec('ls', (err, stdout, stderr) => {
      if (err) {
        console.error(err, job);
      } else {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      }
    });
  }
}

import { test, expect } from 'tooling-suite';
import { SyncProcesses } from './SyncProcesses';
import { SyncProcessesHandler } from './SyncProcessesHandler';
import {
  createAdvancedProcess,
  createCompletedProcess,
  createCompressorServiceMock,
  createContextsMocks,
  createOtherProcess,
  createProcess,
  createTimeServiceMock,
} from 'core';
import type { Process } from 'core';

test('SyncProcesses does not sync before one second', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const timeService = createTimeServiceMock();
  browserWindowContext.timeService = timeService;
  const compressor = createCompressorServiceMock();
  compressor.simulateProcesses([createProcess()]);
  mainProcessContext.compressor = compressor;
  new SyncProcessesHandler(mainProcessContext).register();

  new SyncProcesses(browserWindowContext).register();
  await timeService.advanceTime(999);

  expect(browserWindowContext.processRepository.getProcesses()).toEqual([]);
});

test('SyncProcesses adds active processes after one second', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const timeService = createTimeServiceMock();
  browserWindowContext.timeService = timeService;
  const compressor = createCompressorServiceMock();
  compressor.simulateProcesses([createProcess()]);
  mainProcessContext.compressor = compressor;
  new SyncProcessesHandler(mainProcessContext).register();

  new SyncProcesses(browserWindowContext).register();
  await timeService.advanceTime(1000);

  expect(browserWindowContext.processRepository.getProcesses()).toEqual([createProcess()]);
});

test('SyncProcesses updates process progression', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const timeService = createTimeServiceMock();
  browserWindowContext.timeService = timeService;
  const compressor = createCompressorServiceMock();
  compressor.simulateProcesses([createProcess()]);
  mainProcessContext.compressor = compressor;
  new SyncProcessesHandler(mainProcessContext).register();

  new SyncProcesses(browserWindowContext).register();
  await timeService.advanceTime(1000);
  compressor.simulateProcesses([createAdvancedProcess()]);
  await timeService.advanceTime(1000);

  expect(browserWindowContext.processRepository.getProcesses()).toEqual([createAdvancedProcess()]);
});

test('SyncProcesses keeps disappeared process with full progression', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const timeService = createTimeServiceMock();
  browserWindowContext.timeService = timeService;
  const compressor = createCompressorServiceMock();
  compressor.simulateProcesses([createProcess()]);
  mainProcessContext.compressor = compressor;
  new SyncProcessesHandler(mainProcessContext).register();

  new SyncProcesses(browserWindowContext).register();
  await timeService.advanceTime(1000);
  compressor.simulateProcesses([]);
  await timeService.advanceTime(1000);

  expect(browserWindowContext.processRepository.getProcesses()).toEqual([createCompletedProcess()]);
});

test('SyncProcesses completes only disappeared process among several', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const timeService = createTimeServiceMock();
  browserWindowContext.timeService = timeService;
  const compressor = createCompressorServiceMock();
  compressor.simulateProcesses([createProcess(), createOtherProcess()]);
  mainProcessContext.compressor = compressor;
  new SyncProcessesHandler(mainProcessContext).register();

  new SyncProcesses(browserWindowContext).register();
  await timeService.advanceTime(1000);
  expect(browserWindowContext.processRepository.getProcesses()).toEqual([createProcess(), createOtherProcess()]);
  compressor.simulateProcesses([createOtherProcess()]);
  await timeService.advanceTime(1000);

  expect(browserWindowContext.processRepository.getProcesses()).toEqual([
    createCompletedProcess(),
    createOtherProcess(),
  ]);
});

test('SyncProcesses does not notify when active process is unchanged', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const timeService = createTimeServiceMock();
  browserWindowContext.timeService = timeService;
  const compressor = createCompressorServiceMock();
  compressor.simulateProcesses([createProcess()]);
  mainProcessContext.compressor = compressor;
  new SyncProcessesHandler(mainProcessContext).register();

  new SyncProcesses(browserWindowContext).register();
  await timeService.advanceTime(1000);
  const notifications: Process[][] = [];
  browserWindowContext.processRepository.observeProcesses((processes) => notifications.push(processes));
  await timeService.advanceTime(1000);

  expect(notifications).toEqual([[createProcess()]]);
});

test('SyncProcesses does not notify when completed process stays completed', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const timeService = createTimeServiceMock();
  browserWindowContext.timeService = timeService;
  const compressor = createCompressorServiceMock();
  compressor.simulateProcesses([createProcess()]);
  mainProcessContext.compressor = compressor;
  new SyncProcessesHandler(mainProcessContext).register();

  new SyncProcesses(browserWindowContext).register();
  await timeService.advanceTime(1000);
  compressor.simulateProcesses([]);
  await timeService.advanceTime(1000);
  const notifications: Process[][] = [];
  browserWindowContext.processRepository.observeProcesses((processes) => notifications.push(processes));
  await timeService.advanceTime(1000);

  expect(notifications).toEqual([[createCompletedProcess()]]);
});

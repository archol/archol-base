application samples.ws1.hw

uses:
  hw = samples.ws1.hw

routes:
  '/': hi
  '/${n:number}': hw.hi(n)

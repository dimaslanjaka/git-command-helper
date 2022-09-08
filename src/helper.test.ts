import helper from './helper';

const f = async () => {
  return 'x';
};
console.log('is promise', helper.isPromise(f));
helper.suppress(f).then(console.log);

// const Mock = require('mockjs');
const mockJson = require('./tab1/query.json');
// tab2 use sub files
const tab2Route = require('./tab2');

module.exports = {
  // use json
  'post /tab1/query': mockJson,
  // '/tab1/mock': Mock.mock(require('./tab1/mock.json')),
  // use js object
  '/tab1/js': {
    code: 0,
    msg: '',
    data: [],
  },
  // '/tab1/js-mock': Mock.mock({
  //   code: 0,
  //   msg: '',
  //   data: [],
  // }),
  // use function
  '/tab1/func': (req, res) => {
    res.send({
      req: req.query,
      code: 0,
      msg: '',
      data: [],
    });
  },
  ...tab2Route,
};

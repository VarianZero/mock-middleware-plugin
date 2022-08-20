# mock-middleware-plugin
> For some reason, I can't support the source code. This repository only for answer issue.  

Middleware for mocking data, based on webpack-dev-server.   
- Both support React and Vue.  
- Support hot reloading mock data.
- Support multiple versions of webpack-dev-server
- RESTful API mock support
- Provide built-in mock template files
- Variable methods to generate mock data(json/js object/function)
## Install
```
npm i mock-middlerware-plugin -D
// if use Mockjs, you should install it either
// npm i mockjs -D
```
## Usage
### 0. Auto refresh in browser(if you wanna refresh manually, skip this)
Add the code in your root file (e.g. index.js or app.js)  
Then webpack will watch mock directory either.  
And the browser will reload page after you modify mock files.
```
// react18
const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
// ...
if (process.env.NODE_ENV === 'development') {
// Don't use "require"! Otherwise webpack will stop when mock file has error
  import('../mock');
}
```
### 1. webpack.dev.conf.js(or other config file)
1. webpack-dev-server(v4.7.0+)
```
const mockMiddlewarePlugin = require('mock-middlerware-plugin');
//
devServer: {
  // ...
  proxy: {
    // your config
  },
  setupMiddlewares: (middlewares, devServer) => {
    if (!devServer) {
      throw new Error('webpack-dev-server is not defined');
    }
    middlewares.push(
      mockMiddlewarePlugin(path.resolve(process.cwd(), './mock'),{ log: false })
    );
    return middlewares;
  },
}
```
2. webpack-dev-server(v4 ~ v4.7.0)
```
devServer: {
  onAfterSetupMiddleware: function (devServer) {
    if (!devServer) {
      throw new Error('webpack-dev-server is not defined');
    }
    devServer.app.use(mockMiddleware(path.resolve(process.cwd(), './mock')));
  },
}
```
3. webpack-dev-server(v3+)
```
devServer: {
  after: (app) => {
    app.use(mockMiddleware(path.resolve(process.cwd(), './mock')));
  },
}
```
### 2. mock data files
#### Qucik Start
Since v1.1.0, we support some template mock files in the package.    
By the util, you can copy template files quickly to your target directory.  
```
// webpack.dev.conf.js
const mockUtil = require('mock-middlerware-plugin/util');
mockUtil.initFiles(baseDir);

// baseDir is optional, if omitted , default is 'process.cwd()'
// it will copy the template files into 'baseDir/mock', default is './mock'
// if baseDir/mock exists, the function will return, and will not your override your files
```
#### Custom Define Files
There must be a index.js file in your root mock directory(such as ./mock), the data structure is as follows:
```
// ./mock/index.js
module.exports = {
  // [route]: [mock data],

  '/list/query' : mockJson,

  'post /list/add': (req, res)  => {
    res.send({ msg : "success" })
  }
};
```
#### 2.1 @param {string} [route]
```
route: [method][space][path]  

method: GET/POST/PUT/DELETE; (also can be lowercase); optional, GET method if omitted; 
space: when the method is omitted, the space should be omitted too.
path: the request url; 
```
#### 2.2 @param {object/function/string} [mock data]
There are variable methods to generate mock data. 
1. use json file
```
const mockJson = require('./list/query.json');
module.exports = {
  'get /list/query/:id': mockJson,
}
// You can also make it simpler
module.exports = {
  'get /list/query': require('./list/query.json'),
}
```
2. use javascript object
```
module.exports = {
  'get /list/query': {
    code: 0,
    msg: '',
    data: [],
  },
}
```
3. use function, just like in Express
```
 // According to the req.query/body parameter judgment, return different results
module.exports = {
  'get /list/query': (req, res) => {
    res.send({
      code: 0,
      msg: '',
      data: [],
    })
  }
}
```
4. All the before methods support Mockjs. Remember to use Mock.mock() to wrap the origin data.
```
// json file 
{
  "list|1-10": [
    {
      "id|+1": 1
    }
  ]
}
'/list/mock': Mock.mock(require('./list/mock.json'))

// js object or function
'/list/mock': (req, res) => {
  const data = Mock.mock({
    req: req.query,
    'list|1-10': [
      {
        'id|+1': 1,
      },
    ],
  });
  res.send({ data });
},
```
#### 3. Split root file
When there are too many api to mock, the index.js in root directory may look so huge. So use subfiles to make the root file more compact.
```
// ./mock/list/index.js
module.exports = {
  'get /list/query': mockJson,
  // ...
}

// ./mock/index.js
const listApi = require('./list/index.js');

module.exports = {
  // ...
  ...listApi,
}
```
## Plugin Option
1. mockMiddlewarePlugin(dir, [options])
```
dir: string; // your mock root directory
options: {
  log: boolean; // whether show request log in terminal; default is true!
}
// log demo
// [mock proxy]: GET /list/mock
```
2. util.initFiles([baseDir])  
```
baseDir: string; // if omitted, default is current root directory(process.cwd())
```
## Tips
When you need to use req.body in your mock function, you should add 'body-parser' before the mock plugin!
```
const bodyParser = require('body-parser');
// .webpack.config.js(v5+)
setupMiddlewares: (middlewares, devServer) => {
  middlewares.push(bodyParser.json());
  middlewares.push(bodyParser.urlencoded({ extended: true }));
  middlewares.push(
    mockMiddlewarePlugin(path.resolve(process.cwd(), './mock'),{ log: false })
  );
}

// ./mock/index.js
'post /list/query': (req, res) => {
  res.send({
    reqParams: req.body,
    code: 0,
    msg: '',
    data: [],
  })
}
```
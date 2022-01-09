/**
 * @author MrZenW
 * @email MrZenW@gmail.com, https://MrZenW.com
 */

(function moduleify(moduleFactory) {
  'use strict';

  var useAwextFunction = null;

  if (typeof define === 'function' && define.amd) {
    define('useAwext', ['awext'], function (dep1) {
      useAwextFunction = useAwextFunction || moduleFactory(dep1);
      return useAwextFunction;
    });
  } else if (typeof module === 'object' && typeof exports === 'object') {
    useAwextFunction = useAwextFunction || moduleFactory([require('awext')]);
    module.exports = useAwextFunction;
  }

  var root = (typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this);
  if (root && typeof root === 'object') {
    useAwextFunction = useAwextFunction || moduleFactory(root['awext']);
    root['useAwextFunction'] = awextLib;
  }
}(function moduleFactory(deps_Awext) {
  'use strict';

  if (!deps_Awext) throw new Error('useAwext is depends on Awext library!');

  var _lib_ = {};
  var _isFunction = deps_Awext.isFunction;
  var _isPromise = deps_Awext.isPromise;
  var _genUUID = deps_Awext.genUUID;
  var _blankFunction = deps_Awext.blankFunction;
  var _objectAssign = deps_Awext.objectAssign;
  var _objectBindProps = deps_Awext.objectBindProps;
  var _rebaseAwext = deps_Awext.rebaseAwext;
  var _isNone = deps_Awext.isNone;

  deps_Awext = _objectAssign({}, deps_Awext);

  function useAwext(inputArgs, initFunc, reactLibrary) {
    var { useState, useEffect } = reactLibrary;
    var [awextFlag] = useState({
      uuid: _genUUID(),
      isMounted: true,
    });
    var stateObjectForceUpdateValue = useState(0);
    var setForceUpdateValue = stateObjectForceUpdateValue[1];
    var awextName = ['_created_by_useAwext_', awextFlag.uuid];
    var isFirst = !hasAwext(awextName);
    var awext = createAwext(awextName, {});
    if (isFirst) {
      var isInitFunction = _isFunction(initFunc);
      // bind default functions
      var unoverrideableFuncs = {
        _useAwextForceUpdate: (function () {
          if (awextFlag.isMounted) {
            setForceUpdateValue(_genUUID());
          } else {
            throw new Error('Cannot render an unmounted component!');
          }
        }),
      };
      var useAwextFuncs = {
        isUseAwext: true,
        useAwextArgs: undefined,
        _useAwextInit: isInitFunction ? initFunc : _blankFunction,
        _useAwextReceiveArgs: (function (_inputArgs) { this.useAwextArgs = _inputArgs; }),
        _useAwextAfterRender: _blankFunction,
        _useAwextBeforeRender: _blankFunction,
      };
      _objectAssign(awext, useAwextFuncs, unoverrideableFuncs);
      // END: bind default functions
      if (!isInitFunction) {
        _objectBindProps(awext, initFunc, unoverrideableFuncs);
      }
      awext = _rebaseAwext(
        awextName,
        awext,
      );
      var _returnedDestroyFunction = awext._useAwextInit(
        inputArgs,
        awext._useAwextForceUpdate,
        awext,
      );
      if (_isPromise(_returnedDestroyFunction)) {
        throw new Error('The function _useAwextInit can not either be an async function or return a promise!');
      }
      if (!_isFunction(_returnedDestroyFunction) && !_isNone(_returnedDestroyFunction)) {
        throw new Error('The function _useAwextInit can only return either a function type variable or a none-like variable!');
      }
      awextFlag.destroyFunction = _returnedDestroyFunction;
    } // END: init
    // inputArgs
    awext._useAwextReceiveArgs(inputArgs);
    (function (_awextFlag) { // this function for closture
      useEffect(function () {
        // only once on init
        return function () {
          _awextFlag.isMounted = false;
          if (_isFunction(_awextFlag.destroyFunction)) {
            _awextFlag.destroyFunction(awext);
          }
          awext.awextDiscard();
        };
      }, []);
      useEffect(function () {
        // every times after render
        awext.awextEmit('_useAwextAfterRender', inputArgs);
        awext._useAwextAfterRender(inputArgs);
      });
    }(awextFlag));
    awext.awextEmit('_useAwextBeforeRender', inputArgs);
    awext._useAwextBeforeRender(inputArgs);
    return awext;
  }
  _lib_.useAwext = useAwext;

  return _objectAssign({}, _lib_);
}));

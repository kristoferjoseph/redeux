!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).redeux=e()}}(function(){return function(){return function e(n,t,r){function o(u,f){if(!t[u]){if(!n[u]){var c="function"==typeof require&&require;if(!f&&c)return c(u,!0);if(i)return i(u,!0);var d=new Error("Cannot find module '"+u+"'");throw d.code="MODULE_NOT_FOUND",d}var s=t[u]={exports:{}};n[u][0].call(s.exports,function(e){var t=n[u][1][e];return o(t||e)},s,s.exports,e,n,t,r)}return t[u].exports}for(var i="function"==typeof require&&require,u=0;u<r.length;u++)o(r[u]);return o}}()({1:[function(e,n,t){var r,o="undefined"!=typeof window,i=o?window.requestAnimationFrame:setTimeout,u=o?window.cancelAnimationFrame:clearTimeout;n.exports=function(e){var n=e||{},t=[],o=[],f=[];function c(){var e=d(f.pop());f.length?(u(r),r=i(c)):function(e){var n=0,t=o.length;for(;n<t;n++)o[n](e)}(e)}function d(e){for(var r,o,i=0,u=t.length;i<u;i++)o=(r=t[i]).key||r.name,n[o]=r(n[o],e);return Object.assign({},n)}function s(){return d()}return s.subscribe=function(e){return"function"==typeof e&&o.push(e)},s.unsubscribe=function(e){return o.splice(o.indexOf(e),1)},s.register=function(){for(var e,n=arguments,r=n.length,o=0;o<r;o++)"function"==typeof(e=n[o])&&t.push(e)},s.dispatch=function(e){f.push(e),r=i(c)},s}},{}]},{},[1])(1)});

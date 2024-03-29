/*eslint-env node */
'use strict';

(function(root, factory) {
    
    if (typeof exports === 'object' && exports) {
        factory(exports); // CommonJS
    } else {
        var sUTL = {};
        factory(sUTL);
        if (typeof define === 'function' && define.amd)
            define(sUTL); // AMD
        else
            root.sUTL = sUTL; // <script>
    }

}(this, function(sUTL) {
    
    //exports
    sUTL.name = 'sUTL.js';
    sUTL.version = '0.0.0';
    sUTL.evaluate = evaluate;
    sUTL.compilelib = compilelib;

    function get(obj, key, def)
    {
        if (isObject(obj) && key in obj && obj[key] != null)
            return obj[key];
        else
            return def;
    }

    function gettype(item)
    {
        if (isObject(item))
            return "map"
        else if (isArray(item))
            return "list"
        else if (isString(item))
            return "string"
        else if (isNumber(item))
            return "number"
        else if (isBool(item))
            return "boolean"
        else if (item == null)
            return "null"
        else
            return "unknown"
    }

    function _processPath(startfrom, parentscope, scope, l, src, tt, b, h)
    {    
        var la = get(scope, "a", null);
        var lb = get(scope, "b", null);
        var lnotfirst = get(scope, "notfirst", false);

        if (lnotfirst)
        {
            return _doPath(la, lb);
        }
        else
        {
            // first one. Both a and b are path components.
            var laccum = _doPath([startfrom], la);
            return _doPath(laccum, lb);
        }
    }

    function IsTruthy(aObj)
    {
        var condvalue = aObj;
        if (isArray(condvalue) && condvalue.length === 0)
        {
            condvalue = false;
        }
        if (isObject(condvalue) && Object.keys(condvalue).length === 0)
        {
            condvalue = false;
        }
        condvalue = !!condvalue;
        return condvalue;
    }

    function _doPath(a, b)
    {
        var retval = [];

        if (isArray(a))
        {
            if (b != null && b !== "")
            {
                for (var ix in a)
                {
                    var aItem = a[ix]; 
                    try
                    {
                        if (b === "**") 
                        {
                            retval.push(aItem);
                            var lstack = [aItem];
                            while (lstack.length > 0)
                            {
                                var litem = lstack.pop();
                                if (isObject(litem) || isArray(litem))
                                {
                                    for (var key in litem)
                                    {
                                        retval.push(litem[key]);
                                        lstack.push(litem[key]);
                                    }
                                }
                            }
                        }
                        else if (b === "*")
                        {
                            if (isObject(aItem) || isArray(aItem))
                            {
                                for (var lkey in aItem)
                                {
                                    retval.push(aItem[lkey]);
                                }
                            }
                        }
                        else if (isObject(aItem) && isString(b))
                        {
                            if (b in aItem)
                                retval.push(aItem[b]);
                        }
                        else if (isArray(aItem) && isNumber(b))
                        {
                            if (b in aItem)
                                retval.push(aItem[b]);
                        }
                    }
                    catch (ex)
                    {
                        console.log(ex);
                    }
                }
            }
            else
                retval = a;
        }

        return retval;
    }

    function builtins()
    {
        var retval = {
            "+": function(parentscope, scope, l, src, tt, b, h)
            {
                var a = get(scope, "a", 0);
                var bb = get(scope, "b", 0);
                if (gettype(a) === gettype(bb))
                    return a + bb;
                else
                    return null;
            },
            "-": function(parentscope, scope, l, src, tt, b, h)
            {
                return get(scope, "a", 0) - get(scope, "b", 0);
            },
            "x": function(parentscope, scope, l, src, tt, b, h)
            {
                return get(scope, "a", 1) * get(scope, "b", 1);
            },
            "/": function(parentscope, scope, l, src, tt, b, h)
            {
                return get(scope, "a", 1) / get(scope, "b", 1);
            },
            "=": function(parentscope, scope, l, src, tt, b, h)
            {
                return get(scope, "a", null) === get(scope, "b", null);
            },
            "!=": function(parentscope, scope, l, src, tt, b, h)
            {
                return get(scope, "a", null) !== get(scope, "b", null);
            },
            ">=": function(parentscope, scope, l, src, tt, b, h)
            {
                return get(scope, "a", null) >= get(scope, "b", null);
            },
            "<=": function(parentscope, scope, l, src, tt, b, h)
            {
                return get(scope, "a", null) <= get(scope, "b", null);
            },
            ">": function(parentscope, scope, l, src, tt, b, h)
            {
                return get(scope, "a", null) > get(scope, "b", null);
            },
            "<": function(parentscope, scope, l, src, tt, b, h)
            {
                return get(scope, "a", null) < get(scope, "b", null);
            },
            "&&": function(parentscope, scope, l, src, tt, b, h)
            {
                if ("a" in scope)
                    if ("b" in scope)
                        return IsTruthy(get(scope, "a", false)) && IsTruthy(get(scope, "b", false));
                    else
                        return IsTruthy(get(scope, "a", false));
                else
                    IsTruthy(get(scope, "b", false));
            },
            "||": function(parentscope, scope, l, src, tt, b, h)
            {
                return IsTruthy(get(scope, "a", false)) || IsTruthy(get(scope, "b", false));
            },
            "!": function(parentscope, scope, l, src, tt, b, h)
            {
                return ! IsTruthy(get(scope, "b", false));
            },
            "if": function(parentscope, scope, l, src, tt, b, h)
            {
                var retval = null;
                var condvalue = false;

                if ("cond" in scope)
                {
                    condvalue = IsTruthy(_evaluate(parentscope, scope["cond"], l, src, tt, b, h));
                }
                    

                if (condvalue)
                {
                    if ("true" in scope)
                        retval = _evaluate(parentscope, scope["true"], l, src, tt, b, h);
                }
                else
                {
                    if ("false" in scope)
                        retval = _evaluate(parentscope, scope["false"], l, src, tt, b, h);
                }

                return retval;
            },
            "keys": function(parentscope, scope, l, src, tt, b, h)
            {
                var obj = get(scope, "map", null);
                if (isObject(obj))
                    return Object.keys(obj);
                else
                    return null;
            },
            "values": function(parentscope, scope, l, src, tt, b, h)
            {
                var obj = get(scope, "map", null);
                if (isObject(obj))
                {
                    var vals = Object.keys(obj).map(function (key) {
                        return obj[key];
                    });
                    return vals;
                }
                else
                    return null;
            },
            "len": function(parentscope, scope, l, src, tt, b, h)
            {
                var item = get(scope, "list", null);
                if (gettype(item) === "list")
                    return item.length;
                else
                    return 0;
            },
            "type": function(parentscope, scope, l, src, tt, b, h)
            {
                var item = get(scope, "value", null);
                return gettype(item);
            },
            "makemap":function(parentscope, scope, l, src, tt, b, h)
            {
                retval = {};
                var item = get(scope, "value", null);
                if (isArray(item))
                {
                    for (var ix in item)
                    {
                        var entry = item[ix];
                        if (isArray(entry) && entry.length >= 2 && isString(entry[0]))
                        {
                            retval[entry[0]] = entry[1];
                        }
                    } 

                }
                return retval
            },
            "reduce": function(parentscope, scope, l, src, tt, b, h)
            {
                retval = {}
                var list = get(scope, "list", null)
                var t = get(scope, "t", null)
                var accum = get(scope, "accum", null)

                if (isArray(list))
                {
                    for (var ix in list)
                    {
                        var item = list[ix];

                        var s2 = {};

                        for (var key in parentscope)
                        {
                            s2[key] = parentscope[key];
                        }

                        for (var key in scope)
                        {
                            s2[key] = scope[key];
                        }

                        s2["item"] = item;
                        s2["accum"] = accum;
                        s2["ix"] = parseInt(ix);

                        accum = _evaluate(
                            s2,
                            t,
                            l, src, tt, b, h
                        )
                    } 
                }

                return accum;
            },
            "$": function(parentscope, scope, l, src, tt, b, h)
            {
                return _processPath(src, parentscope, scope, l, src, tt, b, h)
            },
            "@": function(parentscope, scope, l, src, tt, b, h)
            {
                return _processPath(parentscope, parentscope, scope, l, src, tt, b, h)
            },
            "^": function(parentscope, scope, l, src, tt, b, h)
            {
                return _processPath(scope, parentscope, scope, l, src, tt, b, h)
            },
            "*": function(parentscope, scope, l, src, tt, b, h)
            {
                return _processPath(l, parentscope, scope, l, src, tt, b, h)
            },
            "~": function(parentscope, scope, l, src, tt, b, h)
            {
                return _processPath(tt, parentscope, scope, l, src, tt, b, h)
            },
            "%": function(parentscope, scope, l, src, tt, b, h)
            {
                var la = get(scope, "a", null)
                var lb = get(scope, "b", null)
                var lnotfirst = get(scope, "notfirst", false)

                if (lnotfirst)
                {
                    return _doPath(la, lb)
                }
                else
                {
                    if (la == null)
                        return _doPath([lb], null)
                    else
                        return _doPath([la], lb)
                }
            },
            "head": function(parentscope, scope, l, src, tt, b, h)
            {
                var lb = get(scope, "b", null)

                if (isArray(lb) && lb.length)
                    return lb[0]
                else
                    return null;
            },
            "tail": function(parentscope, scope, l, src, tt, b, h)
            {
                var lb = get(scope, "b", null)

                if (isArray(lb))
                {
                    if (lb.length)
                        return lb.slice(1)
                    else
                        return []
                }
                else
                    return null;
            }
        }

        for (var key in retval)
        {
            retval["has" + key] = function(parentscope, scope, l, src, tt, b)
            {
                return true
            }
        }

        return retval
    }

    var cost = 0;

    function getcost()
    {
        return cost;
    }

    function clearcost()
    {
        cost = 0;
    }

    function inccost()
    {
        cost ++;
    }

    function logenter(msg, s, t, h)
    {
        if (h > 0)
        {
            console.log("(" + h + "): " + msg)
            console.log(" - s: " + JSON.stringify(s))
            console.log(" - t: " + JSON.stringify(t))
        }
        inccost();
    }

    function logexit(msg, r, h)
    {
        if (h > 0)
        {
            console.log("(" + h + "): " + msg)
            console.log(" - r: " + JSON.stringify(r))
        }
    }

    function evaluate(src, tt, l, h) 
    {
        clearcost();
        var retval = _evaluate(src, tt, l, src, tt, builtins(), h)
        console.log("Cost: " + getcost())
        return retval;
    }

    function dec(x)
    {
        return x-1
    }

    function _evaluate(s, t, l, src, tt, b, h)
    {
        if (!h) h = 0;

        var r;

        var done = false;
        var s1 = s;
        var t1 = t;
        var l1 = l;
        var counter = 0;

        while (!done)
        {
            logenter("_evaluate: " + counter, s1, t1, h);

            if (isEval(t1))
            {
                r = _evaluateEval(s1, t1, l1, src, tt, b, dec(h));
                done = true;
            }
            else if (isEval2(t1))
            {
                r = _evaluateEval2(s1, t1, l1, src, tt, b, dec(h));
                done = true;
            }
            else if (isBuiltinEval(t1))
            {
                r = _evaluateBuiltin(s1, t1, l1, src, tt, b, dec(h));
                done = true;
            }
            else if (isQuoteEval(t1))
            {
                r = _quoteEvaluate(s1, t1["'"], l1, src, tt, b, dec(h));
                done = true;
            }
            else if (isColonEval(t1))
            {
                r = t1[":"];
                done = true;
            }
            else if (isDictTransform(t1))
            {
                r = _evaluateDict(s1, t1, l1, src, tt, b, dec(h));
                done = true;
            }
            else if (isArrayBuiltinEval(t1, b))
            {
                r = _evaluateArrayBuiltin(s1, t1, l1, src, tt, b, dec(h));
                done = true;
            }
            else if (isListTransform(t1))
            {
                if (t1.length > 0 && t1[0] === "&&")
                    r = _flatten(_evaluateList(s1, t1.slice(1), l1, src, tt, b, dec(h)));
                else
                    r = _evaluateList(s1, t1, l1, src, tt, b, dec(h));
                done = true;
            }
            else if (isStringBuiltinEval(t1, b))
            {
                r = _evaluateStringBuiltin(s1, t1, l1, src, tt, b, dec(h));
                done = true;
            }
            else
            {
                r = t1; // simple transform
                done = true;
            }

            counter++;
        }

        logexit("_evaluate", r, h);
        return r;
    }

    function _quoteEvaluate(s, t, l, src, tt, b, h)
    {
        logenter("_quoteEvaluate", s, t, h);
        var r;

        if (isDoubleQuoteEval(t))
        {
            r = _evaluate(s, t["''"], l, src, tt, b, dec(h));
        }
        else if (isDictTransform(t))
        {
            r = _quoteEvaluateDict(s, t, l, src, tt, b, dec(h));
        }
        else if (isListTransform(t))
        {
            r = _quoteEvaluateList(s, t, l, src, tt, b, dec(h));
        }
        else
        {
            r = t; // simple transform
        }

        logexit("_quoteEvaluate", r, h);
        return r;
    }

    function _getArrayBuiltinName(aOp)
    {
        if (aOp.length) 
            return aOp.slice(1);
        else
            return null;
    }

    function _evaluateStringBuiltin(s, t, l, src, tt, b, h)
    {
        var larr = t.split(".");

        var larr2 = [];

        for (var lix in larr)
        {
            var litem = larr[lix];
            var i = parseInt(litem);
            if (isNaN(i))
                larr2.push(litem);
            else
                larr2.push(i);
        }

        return _evaluateArrayBuiltin(s, larr2, l, src, tt, b, h)
    }
    
    function _evaluateArrayBuiltin(s, t, l, src, tt, b, h)
    {
        var lop = t.slice(0, 1)
        if (lop.length)
            lop = lop[0]

        var lopChar = lop[0]

        var uset = {
            "&": _getArrayBuiltinName(lop),
            "args": t.slice(1), 
//            "args": _evaluateList(s, t.slice(1), l, src, tt, b, h),
            "head": lopChar == "^"
        }

        return _evaluateBuiltin(s, uset, l, src, tt, b, dec(h))
    }
    
    function _evaluateBuiltin(s, t, l, src, tt, b, h)
    {
        logenter("_evaluateBuiltin", s, t, h)

        var retval = null;

        if ("args" in t)
        {
            // args format relies on reducing over the list
            if (t["args"].length == 0)
            {
                var uset = {
                    "&": t["&"]
                }

                retval = _evaluateBuiltinSimple(false, s, uset, l, src, tt, b, dec(h))
            }
            else if (t["args"].length == 1)
            {
                var uset = {
                    "&": t["&"],
                    "b": _evaluate(s, t["args"][0], l, src, tt, b, dec(h))
                }

                retval = _evaluateBuiltinSimple(false, s, uset, l, src, tt, b, dec(h))
            }
            else
            {
                // 2 or more items in the args list. Reduce over them
                var list = _evaluateList(s, t["args"].slice(1), l, src, tt, b, dec(h));
                
                retval = _evaluate(s, t["args"][0], l, src, tt, b, dec(h));

                for (var ix in list)
                {
                    var item = list[ix];

                    uset = {
                      "&": t["&"],
                      "a": retval,
                      "b": item,
                      "notfirst": ix > 0
                    }

                    retval = _evaluateBuiltinSimple(false, s, uset, l, src, tt, b, dec(h))
                } 
            }

            if (isArray(retval) && t["head"])
            {
                if (retval.length)
                    retval = retval[0] 
                else
                    retval = null;
            }
        }
        else
        {
            retval = _evaluateBuiltinSimple(true, s, t, l, src, tt, b, h);
        }

        logexit("_evaluateBuiltin", retval, h)
        return retval
    }

    function _evaluateBuiltinSimple(needseval, s, t, l, src, tt, b, h)
    {
        var retval = null;

        var builtinf = get(b, t["&"], null);

        var llibname;

        if (builtinf)
            llibname = "_override_" + t["&"]
        else    
            llibname = t["&"]

        if (llibname in l)
        {
            var t2 = {};

            for (var key in t)
            {
                t2[key] = t[key];
            }

            t2["!"] = ["^*", t["&"]]
            delete t2["&"]

            retval = _evaluateEval(s, t2, l, src, tt, b, dec(h))
        } 
        else if (builtinf)
        {
            var s2 = {};

            for (var key in s)
            {
                s2[key] = s[key];
            }

            var sX;
            if (needseval)
            {
                sX = _evaluateDict(s, t, l, src, tt, b, dec(h))
            }
            else
            {
                sX = t;
            }

            for (var key in sX)
            {
                s2[key] = sX[key];
            }

            //var s2 = _evaluateDict(s, t, l, src, tt, b, dec(h))

            var l2 = l;
            if ("*" in t)
            {
                l2 = _evaluateDict(s, t["*"], l, src, tt, b, dec(h))
            }

            retval = builtinf(s, s2, l2, src, tt, b, dec(h))
        }

        return retval
    }


    function _evaluateEval(s, t, l, src, tt, b, h)
    {
    	var newscope = {};
    	var t2;

        for (var key in t)
        {
        	if (key !== "!")
	            newscope[key] = t[key];
        }
        
        if (IsTruthy(newscope))
        {
            t2 = {
              "!!": t["!"],
              "s": newscope
            };
        }
        else
        {
            t2 = {
              "!!": t["!"]
            };
        }
        
    	return _evaluateEval2(s, t2, l, src, tt, b, h);
	}

    function _evaluateEval2(s, t, l, src, tt, b, h)
    {
        logenter("_evaluateEval2", s, t, h);

        var retval;

        var t2 = _evaluate(s, t["!!"], l, src, tt, b, dec(h));

        var s2 = s;

        if ("s" in t)
        {
            var ts = _evaluate(s, t.s, l, src, tt, b, dec(h));

            if (isObject(ts))
            {
                s2 = {};

                if (isObject(s))
                {
                    for (var key in s)
                    {
                        s2[key] = s[key];
                    }
                }

                for (var key2 in ts)
                {
                    s2[key2] = ts[key2];
                }
            }
            else 
            {
                s2 = ts;
            }
        }
		
        var l2 = l;
        if ("*" in t)
        {
            l2 = _evaluateDict(s, t["*"], l, src, tt, b, dec(h));
        }

        retval = _evaluate(s2, t2, l2, src, tt, b, dec(h));

        logexit("_evaluateEval", retval, h);
        return retval;
    }

    function _evaluateDict(s, t, l, src, tt, b, h)
    {
        logenter("_evaluateDict", s, t, h);

        var retval = {};
        for (var key in t)
        {
            if ((key != "!") && (key != "&"))
                retval[key] = _evaluate(s, t[key], l, src, tt, b, dec(h));
        }

        logexit("_evaluateDict", retval, h)
        return retval
    }

    function _quoteEvaluateDict(s, t, l, src, tt, b, h)
    {
        logenter("_quoteEvaluateDict", s, t, h)

        var retval = {}
        for (var key in t)
        {
            retval[key] = _quoteEvaluate(s, t[key], l, src, tt, b, dec(h));
        }

        logexit("_quoteEvaluateDict", retval, h)
        return retval
    }

    function _evaluateList(s, t, l, src, tt, b, h)
    {
        logenter("_evaluateList", s, t, h)

        var retval = []
        for (var ix in t)
        {
            retval.push(_evaluate(s, t[ix], l, src, tt, b, dec(h)))
        }

        logexit("_evaluateList", retval, h)
        return retval
    }

    function _quoteEvaluateList(s, t, l, src, tt, b, h)
    {
        logenter("_quoteEvaluateList", s, t, h)

        var retval = []
        for (var ix in t)
        {
            retval.push(_quoteEvaluate(s, t[ix], l, src, tt, b, dec(h)))
        }

        logexit("_quoteEvaluateList", retval, h)
        return retval
    }

//     function _evaluatePathHead(s, t, l, src, tt, b, h)
//     {
//         logenter("_evaluatePathHead", s, t, h)

//         var retval;

//         var path_t = {
//             "&": "path",
//             "path": t
//         }

//         var resultlist = _evaluateBuiltin(s, path_t, l, src, tt, b, dec(h))

//         if (resultlist.length)
//             retval = resultlist[0]
//         else
//             retval = null;

//         logexit("_evaluatePathHead", retval, h)
//         return retval
//     }

//     function _evaluatePath(s, t, l, src, tt, b, h)
//     {
//         logenter("_evaluatePath", s, t, h)

//         var retval;

//         var path_t = {
//             "&": "path",
//             "path": t
//         }

//         retval = _evaluateBuiltin(s, path_t, l, src, tt, b, dec(h))

//         logexit("_evaluatePath", retval, h)
//         return retval
//     }

    function _flatten(lst)
    {
        var retval = []
        for (var ix in lst)
        {
            if (isArray(lst[ix]))
            {
                retval = retval.concat(lst[ix])
            }
            else
            {
                retval.push(lst[ix])
            }
        }
        return retval;
    }

    function isBuiltinEval(obj) {
        return isObject(obj) && "&" in obj;
    }

    function isArrayBuiltinEval(arr, b) {
        var retval = isArray(arr) && arr.length;

        if (retval)
        {
            var lop = arr.slice(0, 1)
            if (lop.length)
                lop = lop[0]
    
            retval = 
                isString(lop) &&
                ((lop.slice(0, 1) == "&") || (lop.slice(0, 1) == "^")) &&
                _getArrayBuiltinName(lop) in b;
        }

        return retval;
    }

    function isStringBuiltinEval(str, b) {
        var retval = false;

        if (isString(str))
        {
            var larr = str.split(".")

            retval = isArrayBuiltinEval(larr, b)
        }

        return retval;
    }

    function isEval(obj) {
        return isObject(obj) && "!" in obj;
    }

    function isEval2(obj) {
        return isObject(obj) && "!!" in obj;
    }

    function isQuoteEval(obj) {
        return isObject(obj) && "'" in obj;
    }

    function isDoubleQuoteEval(obj) {
        return isObject(obj) && "''" in obj;
    }

    function isColonEval(obj) {
        return isObject(obj) && ":" in obj;
    }

    function isDictTransform(obj) {
        return !isArray(obj) && obj === Object(obj);
    }
    
    function isListTransform(obj) {
        return Array.isArray(obj)
    }
    
    function isObject(obj) {
        return !isArray(obj) && obj === Object(obj);
    }
    
    function isArray(obj) {
        return Array.isArray(obj)
    }

    function isString(obj) {
        return (typeof obj === 'string' || obj instanceof String);
    }

    function isNumber(obj) {
        return typeof obj === 'number';
    }

    function isBool(obj) {
        return typeof obj === 'boolean';
    }

    function isPathHeadTransform(obj) {
        return isString(obj) && obj.slice(0, 1) == "#";
    }

    function isPathTransform(obj) {
        return isString(obj) && obj.slice(0, 2) == "##";
    }

    function compilelib(decls, dists, test)
    {
        return _compilelib(decls, dists, {}, test, builtins())
    }

    function _compilelib(decls, dists, l, test, b)
    {
        var resultlib = {};
        var resultliblib = {};

        for (var key in l)
        {
            resultlib[key] = l[key]
        }

        // construct list of names of all required decls not already in the library
        var all_candidate_decls = {}

        for (var dkey in decls)
        {
            var decl = decls[dkey]
            var declname = get(decl, "name", "")
            if ("requires" in decl)
            {
                for (var nix in decl["requires"])
                {
                    var reqname = decl["requires"][nix]
                    if (! (reqname in l))
                    {
                        if (isPrefix(reqname, declname))
                        {
                            resultlib[reqname] = get(decl, "transform-t", null)
                        }
                        else
                        {
                            all_candidate_decls[reqname] = [];
                        }
                    }
                }
            }
        }

//         for (var declix in decls)
//         {
//             var decl = decls[declix]
//             var declname = get(decl, "name", null)

//             if (declname in all_candidate_decls)
//             {
//                 resultlib[declname] = decl
//                 delete all_candidate_decls[declname]
//             } 
//         }

        // get list of candidate decls for each reqname
        for (var reqname in all_candidate_decls)
        {
            for (var distkey in dists)
            {
                var dist = dists[distkey]
                for (var dkey in dist)
                {
                    var decl = dist[dkey]
                    var declname = decl["name"] || ""
                    if (isPrefix(reqname, declname))
                    {
                        all_candidate_decls[reqname].push(decl)
                    }
                }
            }
        }

        // here all_candidate_decls is a dict of candidate_decls by name in decl requires

        var fails = []

        for (var reqname in all_candidate_decls)
        {
            var candidate_decls = all_candidate_decls[reqname]

            if (candidate_decls)
            {
                var fails2total = []
                for (var cdix in candidate_decls)
                {
                    var candidate_decl = candidate_decls[cdix]

                    var clresult = _compilelib([candidate_decl], dists, resultlib, test, b)

                    if ("fail" in clresult)
                    {
                        fails2total = fails2total.concat(clresult["fail"])
                    }
                    else if ("lib" in clresult)
                    {
                        fails2total = [] // not a fail

                        for (var libkey in clresult["lib"])
                        {
                            resultlib[libkey] = clresult["lib"][libkey]
                        }
                        resultliblib[reqname] = clresult["lib"]

                        resultlib[reqname] = get(candidate_decl, "transform-t", null)

                        break;
                    }
                }

                if (fails2total.length)
                {
                    fails = fails.concat(fails2total)
                }
            }
        }

        // here resultlib contains everything we could find for reqnames

        if (test)
        {
            for (var dkey in decls)
            {
                var decl = decls[dkey]
                var declreq = {}
                var declrequires = get(decl, "requires", [])
                for (var declreqix in declrequires)
                {
                    declreq[declrequires[declreqix]] = null;
                } 
                
                // decllib is resultlib filtered by names in decl.requires
                var decllib = {}
                for (var lname in resultlib)
                {
                    if (lname in declreq)
                    {
                        decllib[lname] = resultlib[lname]
                        for (var llname in resultliblib[lname])
                        {
                            decllib[llname] = resultliblib[lname][llname]
                        }
                    }
                } 
                
                // evaluate the test. If truthy, the test fails
                var fail = evaluate(get(decl, "transform-t", null), get(decl, "test-t", null), decllib)
                if (fail)
                    fails = fails.concat(fail)
            }
        } 

        if (fails.length)
            return {"fail": fails}
        else
            return {"lib": resultlib}
    }


    function isPrefix(str1, str2)
    {
        return str2.indexOf(str1) === 0
    }

}));

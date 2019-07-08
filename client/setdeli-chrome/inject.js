// insertion-qsuery v1.0.3 (2016-01-20)
// license:MIT
// Zbyszek Tenerowicz <naugtur@gmail.com> (http://naugtur.pl/)
//
var insertionQ=function(){"use strict";function a(a,b){var d,e="insQ_"+g++,f=function(a){(a.animationName===e||a[i]===e)&&(c(a.target)||b(a.target))};d=document.createElement("style"),d.innerHTML="@"+j+"keyframes "+e+" {  from {  outline: 1px solid transparent  } to {  outline: 0px solid transparent }  }\n"+a+" { animation-duration: 0.001s; animation-name: "+e+"; "+j+"animation-duration: 0.001s; "+j+"animation-name: "+e+";  } ",document.head.appendChild(d);var h=setTimeout(function(){document.addEventListener("animationstart",f,!1),document.addEventListener("MSAnimationStart",f,!1),document.addEventListener("webkitAnimationStart",f,!1)},n.timeout);return{destroy:function(){clearTimeout(h),d&&(document.head.removeChild(d),d=null),document.removeEventListener("animationstart",f),document.removeEventListener("MSAnimationStart",f),document.removeEventListener("webkitAnimationStart",f)}}}function b(a){a.QinsQ=!0}function c(a){return n.strictlyNew&&a.QinsQ===!0}function d(a){return c(a.parentNode)?a:d(a.parentNode)}function e(a){for(b(a),a=a.firstChild;a;a=a.nextSibling)void 0!==a&&1===a.nodeType&&e(a)}function f(f,g){var h=[],i=function(){var a;return function(){clearTimeout(a),a=setTimeout(function(){h.forEach(e),g(h),h=[]},10)}}();return a(f,function(a){if(!c(a)){b(a);var e=d(a);h.indexOf(e)<0&&h.push(e),i()}})}var g=100,h=!1,i="animationName",j="",k="Webkit Moz O ms Khtml".split(" "),l="",m=document.createElement("div"),n={strictlyNew:!0,timeout:20};if(m.style.animationName&&(h=!0),h===!1)for(var o=0;o<k.length;o++)if(void 0!==m.style[k[o]+"AnimationName"]){l=k[o],i=l+"AnimationName",j="-"+l.toLowerCase()+"-",h=!0;break}var p=function(b){return h&&b.match(/[^{}]/)?(n.strictlyNew&&e(document.body),{every:function(c){return a(b,c)},summary:function(a){return f(b,a)}}):!1};return p.config=function(a){for(var b in a)a.hasOwnProperty(b)&&(n[b]=a[b])},p}();"undefined"!=typeof module&&"undefined"!=typeof module.exports&&(module.exports=insertionQ);

function upperFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function constructSetString(mon, set, meta) {
    var output = upperFirst(mon);
    if (set.items.length = 1) output += " @ " + set.items[0];
    output += "\n";

    if (meta === 'lc') {
            output += "Level: " + 5 + "\n";
    } else {
            output += "Level: " + 100 + "\n";
    }
    output += "Ability: " + set.abilities[0] + "\n";

    // handle evs
    var changed = false;
    if (set.evconfigs.length === 1) {
        output += "EVs: ";
        var evs = Object.keys(set.evconfigs[0]);
        for (var i = 0; i < evs.length; i++) {
            if (set.evconfigs[0][evs[i]] != 0) {
                output += set.evconfigs[0][evs[i]] + " " + evs[i] + " / ";
                changed = true;
            }
        }
        if (changed) {
            output = output.substring(0, output.length - 2);
        }
        output += "\n";
    }

    if (set.ivconfigs.length === 1) {
        output += "IVs: ";
        changed = false;
        var ivs = Object.keys(set.ivconfigs[0]);
        for (var j = 0; j < ivs.length; j++) {
            if (set.ivconfigs[0][ivs[i]] != 0) {
                output += set.ivconfigs[0][evs[j]] + " " + ivs[j] + " / ";
            }
        }
        if (changed) {
            output = output.substring(0, output.length - 2);
        }
        output += "\n";
    }

    if (set.natures.length === 1) {
        output += set.natures[0] + " Nature\n";
    }

    for (var x = 0; x < set.moveslots.length; x++) {
        output += "- " + set.moveslots[x][0] + "\n";
    }

    return output;
}

$(document).ready(function() {
    insertionQ('.pokemonedit-buttons').summary(function(e){
        var mon = $('input[name="pokemon"]').val().toLowerCase();
        var gen = room.curTeam.gen;
        var meta = room.curTeam.format.substring(4, room.curTeam.format.length);

        switch(gen) {
            case 1:
                gen = 'rb';
                break;
            case 2:
                gen = 'gs';
                break;
            case 3:
                gen = 'rs';
                break;
            case 4:
                gen = 'dp';
                break;
            case 5:
                gen = 'bw';
                break;
            case 6:
                gen = 'xy';
                break;
            default:
                gen = 'sm';
        }

        var reqURL = "https://setdeli.herokuapp.com/sets/" + gen + "/" + mon + "/" + meta
        $.get(reqURL, function(res) {
            if (res.success) {
                var output = "<select style='margin-left:1%;' id='choose-set'><option value='Choose a set'>Choose a Set</option>";
                for (var i = 0; i < res.data.length; i++) {
                    output += "<option value='" + res.data[i].name + "'>" + res.data[i].name + "</option>";
                }
                output += "</select>";

                $(".pokemonedit-buttons").append(output);
                $("#choose-set").on("change", function() {
                    var set = $(this).children("option:selected").val();

                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data[i].name === set) {
                            $(".pokemonedit").val(constructSetString(mon, res.data[i], meta));
                        }
                    }
                });
            } else {
                $(".pokemonedit-buttons").append("<span>Unable to load smogon sets for this pokemon.</span>");
            }
        });
    });
});

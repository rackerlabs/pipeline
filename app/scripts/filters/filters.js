'use strict';


angular.module('pipelineFilters', []).

filter('GitType', function (Git) {
    return function (input) {
        var b = Git.getRepoType(input);
        
        if (b) { // If the repo is found immediately
            return b;
        } else { // No repo found
            // Then let's strip the html code by building an object and grabbing the text of the suspected link tag
            var d = document.createElement("div");
            d.innerHTML = input;
            
            if (d.querySelector("a")) {
                b = Git.getRepoType(d.querySelector("a").textContent);
            }
            
            if (b) { // Find the type now?
                
                // Set the text content of the a tag as the repo type
                d.querySelector("a").textContent = b;
                
                // And now output the html content of that element we created
                return d.innerHTML;
            } else { // Still no luck?  Well fine, output the original input string. 
                return input;
            }
        }
    }
}).
filter('GitURL', function(Git) {
    return function (branch_name, master_branch) {
        var b = Git.getBranchURL(master_branch, branch_name);
        
        if (!b) {
            b = Git.getRepoURL(branch_name);
        }
             
        if (b) {
            return '<a href="' + b + '" target="_blank">' + branch_name + '</a>';
        } else {
            return branch_name;
        }
    };
}).
filter('parseId', function () {
    return function (id) {
        return parseInt(id.substr(-5), 16);
    };
});
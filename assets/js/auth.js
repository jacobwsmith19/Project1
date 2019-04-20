$(document).ready(function() {

var database = firebase.database();
var auth = firebase.auth();

$("#signup").on("click",function() {
    $('#signupm').modal('show');
    $("#submit").on("click", function(event) {
        event.preventDefault();    
        var email = $("#signup-email").val().trim();
        var passWrd = $("#signup-pswd").val().trim();
        console.log(email,passWrd);
    auth.createUserWithEmailAndPassword(email,passWrd).then(function(cred) {
        console.log(cred);// shows user credential returned from firebase
        userPrefs();
    });// end of authentication to firebase  
});//end of new user function
});// end of signup click function


$("#login").on("click",function(event) {
    $('#loginmdl').modal('show');
    $("#submit").on("click",function() {
        event.preventDefault();
        var email = $("#login-email").val().trim();
        var passWrd = $("#login-pswd").val().trim();
        auth.signInWithEmailAndPassword(email,passWrd).then(function(cred){
            console.log("user logged in");// shows user credential returned from firebase  
        }); // end of login function
});//end of login function
});// end of login click function


$("#signout").on("click",function() {
    event.preventDefault();
    auth.signOut().then(function() {console.log("user logged out");
});    

});// end of signout click function

function userPrefs() {
    $("#preferences").modal('show');
    $("#submit2").on("click",function() {
        event.preventDefault();
        var srchParam = [];
        var address = $("#defaultAddress").val();
        var email = $("#pref-Email").val().trim();
        var passWrd = $("#pref-pswd").val().trim();
        srchParam.push($('input[name=radio1]:checked').val());
        srchParam.push($('input[name=radio2]:checked').val());
        srchParam.push($('input[name=radio3]:checked').val());
        srchParam.push($('input[name=radio4]:checked').val());
        srchParam.push($('input[name=radio5]:checked').val());
        srchParam.map(function(val,i) {
            if (srchParam[i]===undefined){ srchParam.splice(i,1);}
        });
        console.log(address);
        console.log(srchParam);
        database.ref().push({
            Address: address,
            PSWD: passWrd,
            Email: email,
            NewsParam: srchParam
        });//end firebase save    
    }); // end of prefernce input function
};//end of user preferences function
});// end of document ready function
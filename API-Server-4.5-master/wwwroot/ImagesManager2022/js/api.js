const apiBaseURL = "http://localhost:5000/api/images";
const baseURL = "http://localhost:5000/";

function HEAD(successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL,
        type: 'HEAD',
        contentType: 'text/plain',
        complete: request => { successCallBack(request.getResponseHeader('ETag')) },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function GET_ID(id, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/" + id,
        type: 'GET',
        success: data => { successCallBack(data); },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function GET_ALL(successCallBack, errorCallBack, queryString = null) {
    let url = apiBaseURL + (queryString ? queryString : "");
    $.ajax({
        url: url,
        type: 'GET',
        success: (data, status, xhr) => { successCallBack(data, xhr.getResponseHeader("ETag")) },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function POST(data, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: (data) => { successCallBack(data) },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function PUT(bookmark, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/" + bookmark.Id,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(bookmark),
        success: () => { successCallBack() },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function DELETE(id, successCallBack, errorCallBack) {
    $.ajax({
        url: apiBaseURL + "/" + id,
        type: 'DELETE',
        success: () => { successCallBack() },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function POST_LOGIN(loginInfo, errorCallBack) {
    $.ajax({
        url: baseURL + "token",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(loginInfo),
        success: (tokenInfo) => {
            window.sessionStorage.setItem("access_token", JSON.stringify(tokenInfo));
            GET_USER(tokenInfo.UserId);   
            window.location.reload();
        },
        error: function (jqXHR) {
            errorCallBack(jqXHR.status)
        }
    });
}
function GET_USER(userId){
    $.ajax({
        url: baseURL + "accounts/index/" + userId,
        type: 'GET',
        contentType: 'application/json',
        success: (data) => { 
            window.sessionStorage.setItem("user_info", JSON.stringify(data)); 
        },
        error: () => {console.log("Erreur");}
    });
}
function POST_LOGOUT(userId){
    $.ajax({
        url: baseURL + "accounts/logout/" + userId,
        type: 'GET',
        contentType: 'application/json',
        success: (data) => {
            window.sessionStorage.clear();
            window.location.reload();
        },
        error: () => {console.log("Impossible de se déconnecter");}
    });
}
// two fonctions for register : one to create the account an one to link the image 
function POST_REGISTER(registerInfo, errorCallBack) {
    $.ajax({
        url: baseURL + "accounts/register",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(registerInfo),
        success: (tokenInfo) => {
            window.sessionStorage.setItem("access_token", JSON.stringify(tokenInfo));
            GET_USER(JSON.parse(window.sessionStorage.getItem("access_token")).Id);
            window.location.reload();
        },
        error: function (jqXHR) {
            errorCallBack(jqXHR.status)
        }
    });
}
function GET_VERIFY(verifyInfo, errorCallBack) {
    $.ajax({        
        url: baseURL + "accounts/verify?id=" + verifyInfo.Id + "&code=" + verifyInfo.Code,
        type: 'GET',
        contentType: 'application/json',
        success: data => { 
            POST_LOGOUT(JSON.parse(window.sessionStorage.getItem("access_token")).Id);
            window.location.reload(); 
        },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function PUT_MODIFY_USER(userInfo, errorCallBack) {
    $.ajax({
        url: baseURL + "accounts/modify/" + userInfo.Id,
        type: 'PUT',
        contentType: 'application/json',
        headers: { Authorization: "Bearer " + JSON.parse(window.sessionStorage.getItem("access_token")).Access_token },
        data: JSON.stringify(userInfo),
        success: () => {
            GET_USER(userInfo.Id);
            let user = {
                Email : JSON.parse(window.sessionStorage.getItem("user_info")).Email,
                Password : JSON.parse(window.sessionStorage.getItem("user_info")).Password
            };
            POST_LOGIN(user,errorCallBack);
            window.location.reload();
        },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}

function GET_DELETE(userInfo, errorCallBack) {
    $.ajax({
        url: baseURL + "accounts/remove/" + userInfo.Id,
        type: 'GET',
        contentType: 'application/json',
        headers : { Authorization: "Bearer " + JSON.parse(window.sessionStorage.getItem("access_token")).Access_token },
        success: () => {},
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
//  url: baseURL + "accounts/logout/" + userId,
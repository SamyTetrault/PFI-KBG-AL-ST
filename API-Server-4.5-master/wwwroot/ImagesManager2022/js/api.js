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
        error: () => {console.log("Impossible de se connecter");}
    });
}
// two fonctions for register : one to create the account an one to link the image
function POST_REGISTER(registerInfo, errorCallBack) {
    let register = {
        Id: 0,
        Name: registerInfo.Name,
        Email: registerInfo.Email,
        Password: registerInfo.Password
    };
    $.ajax({
        url: baseURL + "accounts/register/" + register,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(register),
        success: (tokenInfo) => {
            window.sessionStorage.setItem("access_token", JSON.stringify(tokenInfo));
            let avatarInfo = {
                previousGUID: "",
                imageDataBase64: registerInfo.Avatar
            }
            console.log(registerInfo.Avatar);
            //POST_AVATAR(avatarInfo);
            //console.log(guid);
            // Post qui modify le avatar guid du user
            /*
            let userInfo = {
                Id: window.sessionStorage.access_token,
                AvatarGUID : ,
                ImageData : 
            }
            */
            //window.location.reload();
        },
        error: function (jqXHR) {
            errorCallBack(jqXHR.status)
        }
    });
}
function POST_AVATAR(imageInfo, errorCallBack) {
    $.ajax({
        url: baseURL + "imageFilesRepository/storeImageData/" + imageInfo,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(imageInfo),
        success: (tokenInfo) => { 
            console.log(JSON.stringify(tokenInfo));
            //return tokenInfo.GUID;
        },
        error: () => {console.log("Erreur");}
    });
}

//  url: baseURL + "accounts/logout/" + userId,
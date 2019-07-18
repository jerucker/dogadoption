var loggedInUser;
var page_state = "";

$(document).ready(function() {
  // initRoutes();
  // $('.carousel').carousel()
  // allDogs();
  // $('.nav-all-dogs').onClick(function())

  //On load the app is in a login state
  router("login");

  //========ON CLICK FUNCTIONS FOR NAVBAR===============================

  $("#view_dogs").click(function(e) {
    console.log("viewing dogs");
    e.stopImmediatePropagation();
    e.preventDefault();
    router("allDogs");
  });

  $("#view_favorites").click(function(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    router("showFavorites");
  });

  $("#dog_form").click(function(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    router("submit_dog");
  });

  $("#insert_dog").click(function(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    router("submit_dog");
  });

  $("#logout").click(function(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    loggedInUser = undefined;
    console.log(loggedInUser);
    router("login");
  });

  //==========ON CLICK FOR ALL FORM BUTTONS================================

  $("#submit_dog").on("click", function(event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    console.log("submit dog");

    var newDog = {
      dog_name: $("#dog_name").val(),
      dog_breed: $("#dog_breed").val(),
      dog_age: $("#dog_age").val(),
      dog_img_url: $("#dog_img_url").val(),
      dog_blurb: $("#dog_blurb").val(),
      //jimmy contribution
      owner_name: $("#owner_name").val()
    };
    console.log(newDog);
    submitDog(newDog);
  });

  $("#signup_button").on("click", function(event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    console.log("Sign UP");

    var newUser = {
      user_email: $("#new_user_email").val(),
      username: $("#new_username").val(),
      password: $("#new_user_password").val()
    };
    console.log(newUser);
    signUp(newUser);
  });

  $("#login_button").on("click", function(event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    console.log("Sign In");

    var loginAttempt = {
      username: $("#login_username").val(),
      password: $("#login_password").val()
    };
    console.log(loginAttempt);
    userLogin(loginAttempt);
  });

  $("body").on("click", ".add_favorite", function() {
    console.log("Add Favorite: " + $(this).val());
    var new_favorite = {
      dog_id: $(this).val(),
      user_id: loggedInUser
    };
    console.log(new_favorite);
    addFavorite(new_favorite);
  });

  $("body").on("click", ".remove_favorite", function() {
    console.log("Remove Favorite: " + $(this).val());
    var fav_to_delete = {
      fav_id: $(this).val()
    };
    console.log(fav_to_delete);
    deleteFavorite(fav_to_delete);
  });

  $("body").on("click", ".adopt_me", function() {
    console.log("Adopt Dog: " + $(this).val());
    var dog_id = $(this).val();
    console.log(dog_id);
    console.log(page_state + " PAGE STATE?");
    adoptDog(dog_id);

    var fav_to_delete = {
      dog_id: $(this).val()
    };
    deleteManyFavorites(fav_to_delete);
    if (page_state == "allDogs") {
      showAllDogs();
    } else if (page_state == "showFavorites") {
      console.log("NOT IN ALL DOGS PAGE STATE");
      showFavorites(loggedInUser);
    }
  });
});

//============='Page State' Controls============================================
//adding and removing .hidden controls what html is visible on the dom

function router(id) {
  if (id === "login") {
    $(".navlist").addClass("hidden");
    $(".view-container").addClass("hidden");
    showLogin();
    page_state = "login";
  } else if (id === "allDogs") {
    console.log("alldogs");
    $(".view-container").addClass("hidden");
    $("#allDogs-state-container").removeClass("hidden");
    $(".navlist").removeClass("hidden");

    console.log(loggedInUser + " LOGGED IN");
    showAllDogs();
    page_state = "allDogs";
    console.log(page_state);
  } else if (id === "showFavorites") {
    $(".view-container").addClass("hidden");
    $("#favorites-state-container").removeClass("hidden");
    showFavorites(loggedInUser);
    page_state = "showFavorites";
  } else if (id === "submit_dog") {
    $(".view-container").addClass("hidden");
    $("#submit-dog-state-container").removeClass("hidden");
    page_state = "submit_dog";
  }
}

// ==========FUNCTION FOR DEFAULT "PAGE STATE"=======================================

function showLogin() {
  console.log("show login now");
  $("#login-state-container").removeClass("hidden");
}

//=========AJAX CALLS==============================================================

function showAllDogs() {
  $("#allDogs").css("display", "block");

  $("#allDogs-state-container")
    .empty()
    .prepend("<div class='row dog-card'></div>");
  $.ajax({ url: "/api/dogs/", method: "GET" }).then(function(response) {
    console.log("running");
    console.log(response);
    for (var i = 0; i < response.length; i++) {
      $(".dog-card").append(
        "<div class='col-auto mb-3 mr-3'><div class='card' width: 25rem;'> <p>image</p><img src=" +
          response[i].dog_img_url +
          " class='card-img-top'> <div class='card-body'> <h5 class='card-title'>" +
          response[i].dog_name +
          "</h5> <p class='card-text'>" +
          response[i].dog_blurb +
          "</h5> <p class='card-text'> owner name" +
          response[i].owner_name +
          "</p> <button type='button'  class='button adopt_me' value =" +
          response[i].dog_id +
          ">Adopt Me!</button> <button type='button' class='button add_favorite' value =" +
          response[i].dog_id +
          ">Add Favorite</button> </div> </div> </div>"
      );
    }
  });
}

function submitDog(newDog) {
  console.log("FROM SUBMIT DOG FUNCTION: ");
  console.log(newDog);
  $.ajax({ url: "/api/dogs/", data: newDog, method: "POST" }).then(function(
    response
  ) {
    console.log("running");
    console.log(response);
  });
}

function adoptDog(dog_id) {
  console.log("FROM ADOPTDOG FUNCTION: " + dog_id);
  adoptUpdate = {
    dog_id: dog_id
  };

  $.ajax({ url: "/api/dogs/adopt", data: adoptUpdate, method: "PUT" }).then(
    function(response) {
      console.log("running");
      console.log(response);
      console.log(response.changedRows);
      if (response.changedRows >= 1) {
        console.log("DOG WAS ADOPTED");

        deleteManyFavorites(fav_to_delete);
      } else {
        console.log("DOG WAS ALREADY ADOPTED");
      }
    }
  );
}

function signUp(newUser) {
  console.log("FROM SUBMIT USER FUNCTION: ");
  console.log(newUser);
  $.ajax({ url: "/api/users/", data: newUser, method: "POST" }).then(function(
    response
  ) {
    console.log("running");
    console.log(response);
    console.log(response.insertId);
    if (response.insertId) {
      console.log("INSERTED");

      var loginAttempt = {
        username: newUser.username,
        password: newUser.password
      };
      console.log(loginAttempt);
      userLogin(loginAttempt);
    } else {
      console.log("NOT INSERTED");
    }
  });
}

function userLogin(loginAttempt) {
  console.log("FROM USERLOGIN FUNCTION: ");
  console.log(loginAttempt);
  $.ajax({ url: "/api/user/login", data: loginAttempt, method: "POST" }).then(
    function(response) {
      console.log("running");
      console.log(response);
      if (response.message === "All good") {
        console.log(response.currUser);
        loggedInUser = response.currUser;
        router("allDogs");
      } else {
        console.log("wrong credentials");
      }
    }
  );
}

function showFavorites(loggedInUser) {
  console.log("FROM SHOW FAVORITES FUNCTION: ");
  console.log(loggedInUser);
  $.ajax({ url: "/api/user/favorites/" + loggedInUser, method: "GET" }).then(
    function(response) {
      console.log("running");
      console.log(response);

      $("#favorites-state-container")
        .empty()
        .prepend("<div class='row dog-card'></div>");
      for (var i = 0; i < response.length; i++) {
        $(".dog-card").append(
          "<div class='col-auto mb-3 mr-3'><div class='card' width: 25rem;'> <img src=" +
            response[i].dog_img_url +
            " class='card-img-top'> <div class='card-body'> <h5 class='card-title'>" +
            response[i].dog_name +
            "</h5> <p class='card-text'>" +
            response[i].dog_blurb +
            "</p> <button type='button'  class='button adopt_me' value =" +
            response[i].dog_id +
            ">Adopt Me!</button> <button type='button'  class='button remove_favorite' value =" +
            response[i].fav_id +
            ">Remove Favorite</button> </div> </div> </div>"
        );
      }
    }
  );
}

function addFavorite(new_favorite) {
  console.log("FROM ADD FAVORITE FUNCTION: ");
  console.log(new_favorite);
  $.ajax({ url: "/api/favorite/", data: new_favorite, method: "POST" }).then(
    function(response) {
      console.log("running");
      console.log(response);
    }
  );
}

function deleteFavorite(fav_to_delete) {
  console.log("FROM DELETEFAVORITE FUNCTION: ");
  console.log("DELETE ME: " + fav_to_delete.fav_id);
  $.ajax({ url: "/api/favorite/", data: fav_to_delete, method: "DELETE" }).then(
    function(response) {
      console.log("running");
      console.log(response);
      showFavorites(loggedInUser);
    }
  );
}

function deleteManyFavorites(fav_to_delete) {
  console.log("FROM ADD DELETEMANYFAVORITES FUNCTION: ");
  console.log("DELETE ME: " + fav_to_delete.dog_id);
  $.ajax({
    url: "/api/favorites/",
    data: fav_to_delete,
    method: "DELETE"
  }).then(function(response) {
    console.log("running");
    console.log(response);
    showFavorites(loggedInUser);
  });
}

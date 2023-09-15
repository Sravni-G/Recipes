$(document).ready(function () {
  var storedFavList = localStorage.getItem("favList");
  if (storedFavList) {
    favList = JSON.parse(storedFavList);
    // Call the function to display favorite meals
    showFavMeals();
  }
  showMeals();
});

function showMeals() {
  var mealName = $("#my-meal").val();
  //   console.log("meal", mealName);
  var mealsData = $("#showMeals");
  mealsData.empty();
  var fmeals = $("#showFavMealList");
  fmeals.empty();
  var mealsDataHtml = "";
  $.ajax({
    url: "https://www.themealdb.com/api/json/v1/1/search.php?s=" + mealName,
    success: function (result) {
      //   console.log("res", result);
      for (var i = 0; i < result.meals.length; i++) {
        if (favList.includes(result.meals[i].idMeal)) {
          mealsDataHtml =
            "<div class='card mb-3'><img class='card-img-top' src=" +
            result.meals[i].strMealThumb +
            "><div class='card-body'><h3 class='card-title'>" +
            result.meals[i].strMeal +
            "</h3><p class='meal-id'>" +
            result.meals[i].idMeal +
            "</p><a href='#' onClick=showMore(this)>Show More</a><br><button onClick='favourites(this)' id='favourites'><i class='fa-solid fa-heart'></i></button></div></div>";
        } else {
          mealsDataHtml =
            "<div class='card mb-3'><img class='card-img-top' src=" +
            result.meals[i].strMealThumb +
            "><div class='card-body'><h3 class='card-title dishName'>" +
            result.meals[i].strMeal +
            "</h3><p class='meal-id'>" +
            result.meals[i].idMeal +
            "</p><a href='#' onClick=showMore(this)>Show More</a><br><button onClick='favourites(this)' id='favourites'><i class='fa-regular fa-heart'></i></button></div></div>";
        }
        mealsData.append(mealsDataHtml);
      }

      //showMeals.html("<p>${result.strMeal}</p>");
    },
  });
}

function showFavMeals() {
  var mealsData = $("#showMeals");
  mealsData.empty();
  var fmeals = $("#showFavMealList");
  fmeals.empty();
  console.log("favList:", favList);
  console.log("localStorage favList:", localStorage.getItem("favList"));
  console.log(favList.length);
  if (favList.length <= 1) {
    let msg =
      "<p id='no-fav'>No Favouries are Added<i class='fa-solid fa-face-smile'></i></p>";
    fmeals.append(msg);
  }
  for (let i = 1; i < favList.length; i++) {
    $.ajax({
      url: "https://themealdb.com/api/json/v1/1/lookup.php?i=" + favList[i],
      success: function (result) {
        if (result.meals.length > 0) {
          var meal = result.meals[0];
          let favMealsData =
            "<div class='card mb-3'><img class='card-img-top' src=" +
            meal.strMealThumb +
            "><div class='card-body'><h3 class='card-title dishName'>" +
            meal.strMeal +
            "</h3><p class='meal-id'>" +
            meal.idMeal +
            "</p><a href='#' onClick=showMore(this)>Show More</a><br><button onClick='removeFromFav(this)' id='favourites'><i class='fa-solid fa-heart'></i></button></div></div>";
          var fmeals = $("#showFavMealList");
          fmeals.append(favMealsData);
        }
      },
    });
  }
}

function removeFromFav(button) {
  var dishid = $(button).closest(".card").find(".meal-id").text();
  let index = favList.indexOf(dishid);
  favList.splice(index, 1);
  localStorage.setItem("favList", JSON.stringify(favList));
  showFavMeals();
}
var favList = new Array();
var isFav = false;

function favourites(button) {
  console.log("favbutton", button);
  var dishid = $(button).closest(".card").find(".meal-id").text();
  console.log("id" + dishid);
  if (favList.includes(dishid)) {
    let index = favList.indexOf(dishid);
    favList.splice(index, 1);
  } else {
    favList.push(dishid);
  }
  localStorage.setItem("favList", JSON.stringify(favList));
  showMeals();
}

function showMore(a) {
  $("#showMeals").empty();
  $("#showFavMealList").empty();
  $("#search").empty();
  var mealsData = $("#showMeals");
  var moreDetails = "";
  var id = $(a).closest(".card").find(".meal-id").text();
  $.ajax({
    url: "https://themealdb.com/api/json/v1/1/lookup.php?i=" + id,
    success: function (result) {
      console.log(result);
      moreDetails =
        "<div class='moreDetails'><h2>" +
        result.meals[0].strMeal +
        "</h2><p>" +
        result.meals[0].strInstructions +
        "</p><a target='_blank' href=" +
        result.meals[0].strSource +
        ">To Blog Page</a><br><a target='_blank' href=" +
        result.meals[0].strYoutube +
        ">Watch Here</a></div>";
      mealsData.append(moreDetails);
    },
  });
}

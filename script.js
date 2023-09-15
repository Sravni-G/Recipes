//ready function in jquery is the first function which runs when we load the page
$(document).ready(function () {
  var storedFavList = localStorage.getItem("favList");
  if (storedFavList) {
    favList = JSON.parse(storedFavList);
    // Call the function to display favorite meals
    showFavMeals();
  }
  showMeals();
});
//showMeals function is written to display the meals according to the search
function showMeals() {
  //to get the value of input box where the user entered the required meal
  var mealName = $("#my-meal").val();
  //   console.log("meal", mealName);
  var mealsData = $("#showMeals");
  //before displaying the related content i am clearing the previously added meals or else it will display n no of times
  mealsData.empty();
  var fmeals = $("#showFavMealList");
  //same here also clearing the items added to favourites
  fmeals.empty();
  var mealsDataHtml = "";
  //we are making ajax request to the url/api
  $.ajax({
    url: "https://www.themealdb.com/api/json/v1/1/search.php?s=" + mealName,
    //on success it will do the things written in function and we collect result in form of arguments
    success: function (result) {
      //   console.log("res", result);
      for (var i = 0; i < result.meals.length; i++) {
        //here first i am checking whether the meal is present in favList or not
        //if present it wii show the favourites button as solid
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
          //if not in favList then regular heart so we can distinguish which are added to favList
          mealsDataHtml =
            "<div class='card mb-3'><img class='card-img-top' src=" +
            result.meals[i].strMealThumb +
            "><div class='card-body'><h3 class='card-title dishName'>" +
            result.meals[i].strMeal +
            "</h3><p class='meal-id'>" +
            result.meals[i].idMeal +
            "</p><a href='#' onClick=showMore(this)>Show More</a><br><button onClick='favourites(this)' id='favourites'><i class='fa-regular fa-heart'></i></button></div></div>";
        }
        //here we are appending the html code written to the div element written in index.html
        mealsData.append(mealsDataHtml);
      }
    },
  });
}
//This function is to display the favourite meals that the user added to favourites
function showFavMeals() {
  //first we are clearing the showMeals so that we can display only favList meals
  var mealsData = $("#showMeals");
  mealsData.empty();
  //This is to avoid showing the favList items multiple times
  var fmeals = $("#showFavMealList");
  fmeals.empty();
  console.log("favList:", favList);
  //checking the favList length if it is 0 then there are no items added to favList so it will show message
  if (favList.length == 0) {
    let msg =
      "<p id='no-fav'>No Favouries are Added<i class='fa-solid fa-face-smile'></i></p>";
    fmeals.append(msg);
  }
  //If there are favourite items then we will loop the items and display every item in favList
  for (let i = 0; i < favList.length; i++) {
    //making ajax request to required api
    $.ajax({
      url: "https://themealdb.com/api/json/v1/1/lookup.php?i=" + favList[i],
      //if success then displaying the items in favList
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
//This function is to remove the items from favList
function removeFromFav(button) {
  var dishid = $(button).closest(".card").find(".meal-id").text();
  let index = favList.indexOf(dishid);
  favList.splice(index, 1);
  localStorage.setItem("favList", JSON.stringify(favList));
  showFavMeals();
}
var favList = new Array();

//add to favourites function
function favourites(button) {
  console.log("favbutton", button);
  var dishid = $(button).closest(".card").find(".meal-id").text();
  console.log("id" + dishid);
  //first we are checking whether the item is in favList or not using includes() of function
  if (favList.includes(dishid)) {
    //if present getting index using indexOf() function
    let index = favList.indexOf(dishid);
    //by using splice method we are deleting the item
    favList.splice(index, 1);
  } else {
    //if not present adding the item to favList using push() function
    favList.push(dishid);
  }
  localStorage.setItem("favList", JSON.stringify(favList));
  showMeals();
}
//function to shoe more details above each item when you click on showe more
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

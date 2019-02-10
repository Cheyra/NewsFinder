$("document").ready(function () {
    $(".news").empty()
    let comment;
    let articleID;
    // let star;

    // Grab the articles as a json when page loads, append to the page
    displayData = function() {
	$.getJSON("/articles", function(data) {
      
        // For each one
        for (var i = 0; i < data.length; i++) {
          // Display the information on the page
          let newscard = $("<div></div>").addClass("card newscard my-2");
        //   let titleAndPic = $("<div></div").addClass(row)
                    let newsTitle = $("<div></div>").text(data[i].title);
                    newsTitle.addClass("newsTitle")
                    let newsPic = $("<img></img").attr("src", data[i].image);
                    newsPic.addClass("newsPic")
                    
                    let newsLink = $("<a></a>").text("https://www.allsides.com" + data[i].link);
                      newsLink.attr("href", "https://www.allsides.com" + data[i].link);
                      newsLink.addClass("newsLink")
                    let newsSummary = $("<div></div>").text(data[i].description);
                    newsSummary.addClass("newsSummary ")
                    let favoriteButton = $("<div data-id='" + data[i]._id + "'></div").text("Favorite")
                    let commentButton = $("<div data-id='" + data[i]._id + "'></div").text("Add a comment")
                    commentButton.addClass("btn buttons btn-primary comment-button") 
                    let commentForm = $("<input data-id='" + data[i].comments[0] + "'> </input>")
                    commentForm.addClass("comment-entered")
                    commentForm.attr("placeholder", "Enter your comment here")
                    favoriteButton.addClass("btn buttons btn-primary add-favorite") 
                    let commentsList = $("<div> </div").text("Previous Comments")
                    commentsList.addClass("c-list mt-1")
                  //   star = $("<i></i>");
                  //   star.addClass("far fa-star")
                    newscard.append(newsTitle)
                    newscard.append(newsPic)
                    newscard.append(newsSummary)
                    // titleAndPic.append(newsPic)
                    // titleAndPic.append(newsSummary)
                    
                    // newscard.append(titleAndPic)
                    newscard.append(newsLink)
                    newscard.append(favoriteButton)
                  //   newscard.append(star)
                    newscard.append(commentButton)
                    newscard.append(commentForm)
                    newscard.append(commentsList)
     let check=data[i].comments
                        // console.log(data)
                    $.getJSON("/comment", function(res) {
                         
                            for(let j=0; j<res.length; j++){
                                // console.log(res[j]._id)
                                // console.log(check)
                                let commentCheck= res[j]._id
                                let newcomment = res[j].message
                                for(let j=0; j<check.length; j++){

                                
                     if (commentCheck === check[j]){
                        //  console.log(newcomment)
                          let newcomments = $("<div></div>").text(newcomment)
                          newcomments.addClass("card comment-section my-1")
                        newscard.append(newcomments)
                      
                     }
                            }
                        }
                        })      
                    $(".news").append(newscard)
                    $(".favorites").hide();
                    $(".news-stuff").show();
       }
      });
    }
displayData()
  

$(document).on("click", ".favorites-button", function(){


        $(".favorites").show();
        $(".news-stuff").hide();
})
$(document).on("click", ".news-button", function(){
    $(".favorites").hide();
$(".news-stuff").show();
})
$(document).on("click", ".add-favorite", function(comment){
   let star = $("<i></i>");
    star.addClass("far fa-star")
    $(".news").append(star)
    // star.removeClass("far")
    // star.addClass("fas")
 articleID = $(this).attr("data-id");
        console.log(articleID);
        $.ajax({
            method: "POST",
            url: "/favorite/" + articleID,
            data: {
              favorite: true
            }
          }).done(function(data) {
          // Log the response
        //   console.log("data: ", data);
            });
        //    $(this.hide()
});
// Display saved articles on page load
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        // if article has been marked as saved
        if (data[i].favorite === true) {
              // Display the information on the page
              let newscard = $("<div></div>").addClass("card newscard my-2");
              let newsTitle = $("<div></div>").text(data[i].title);
              newsTitle.addClass("newsTitle")
              let newsPic = $("<img></img").attr("src", data[i].image);
              newsPic.addClass("newsPic");
              
              let newsLink = $("<a></a>").text("https://www.allsides.com" + data[i].link);
              newsLink.addClass("newsLink")
                newsLink.attr("href", "https://www.allsides.com" + data[i].link);
              let newsSummary = $("<div></div>").text(data[i].description);
              newsSummary.addClass("newsSummary")
              let unfavoriteButton = $("<div data-id='" + data[i]._id + "'></div").text("Remove")
              let commentButton = $("<div data-id='" + data[i]._id + "'></div").text("Add a comment")
              commentButton.addClass("btn buttons btn-primary comment-button") 
              let commentForm = $("<input> </input>")
              commentForm.addClass("comment-entered comments-list")
              commentForm.attr("placeholder", "Enter your comment here")
              unfavoriteButton.addClass("btn buttons btn-primary remove-favorite") 
              let commentsList = $("<div> </div").text("Previous Comments")
              commentsList.addClass("c-list mt-1")
            //   let comments-list = $("<div> </div>")
            //   comments-list.addClass("comments-list")
            //   star = $("<i></i>");
            //   star.addClass("far fa-star")
              newscard.append(newsTitle)
              newscard.append(newsPic)
              newscard.append(newsSummary)
              newscard.append(newsLink)
              newscard.append(unfavoriteButton)
            //   newscard.append(star)
              newscard.append(commentButton)
              newscard.append(commentForm)
              newscard.append(commentsList)
              let check=data[i].comments
              // console.log(data)
          $.getJSON("/comment", function(res) {
               
                  for(let j=0; j<res.length; j++){
                      // console.log(res[j]._id)
                      // console.log(check)
                      let commentCheck= res[j]._id
                      let newcomment = res[j].message
                      for(let j=0; j<check.length; j++){

                      
           if (commentCheck === check[j]){
              //  console.log(newcomment)
                let newcomments = $("<div></div>").text(newcomment)
                newcomments.addClass("card comment-section my-1")
              newscard.append(newcomments)
            
           }
                  }
              }
              })
              $(".favorites-stuff").append(newscard)
             
        }
    }
  });
  $(document).on("click", ".remove-favorite", function(){
console.log("deleted")
articleID = $(this).attr("data-id");
        console.log(articleID);
        $.ajax({
            method: "POST",
            url: "/unfavorite/" + articleID,
            data: {
              favorite: false
            }
          }).done(function(data) {
            console.log("deleted  " + data )
          });
  })
$(document).on("click", ".comment-button", function(){
    articleID = $(this).attr("data-id");

    // console.log($(this))
        comment = $(this).next().val().trim()
        // .val().trim();
        console.log(comment)
        // console.log(comment)
        $.ajax({
            method: "POST",
            url: "/comment/" + articleID,
            data: {
              // Value taken from body input
              message: comment
            }
          }).done(function(data) {
          // Log the response
          console.log("data: ", data);
         
            }).then(function(){
                displayData()
            })

        }); 
 


});
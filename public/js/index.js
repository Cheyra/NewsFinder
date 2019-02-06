$("document").ready(function () {
    $(".news").empty()
    let getArticles = function(){
    return $.ajax({
        url: "articles",
        type: "GET"
      }).then(function(data){
          console.log(data[1].title)
          for(let i=0; i<data.length; i++){
            console.log(data[i].title)
              let newscard = $("<div></div>").addClass("card newscard");
              let newsTitle = $("<div></div>").text(data[i].title);
              let newsPic = $("<img></img").attr("src", data[i].image);
              newsPic.attr("width", "200px");
              
              let newsLink = $("<a></a>").text("https://www.allsides.com" + data[i].link);
                newsLink.attr("href", "https://www.allsides.com" + data[i].link);
              let newsSummary = $("<div></div>").text(data[i].description);
              let favoriteButton = $("<div></div").text("Favorite")
              let commentButton = $("<div></div").text("Add a comment")
              commentButton.addClass("btn buttons btn-primary comment-button") 
              let commentForm = $("<form> </form>")
              commentForm.addClass("comment-entered")
              favoriteButton.addClass("btn buttons btn-primary favorite-button") 
              newscard.append(newsTitle)
              newscard.append(newsPic)
              newscard.append(newsLink)
              newscard.append(newsSummary)
              newscard.append(favoriteButton)
              newscard.append(commentButton)
              newscard.append(commentForm)
              $(".news").append(newscard)
             
              $(".favorites").hide();
              $(".news-stuff").show();
          }
      });
    };
    
    getArticles();


$(document).on("click", ".favorites-button", function(){
    $(".favorites").show();
$(".news-stuff").hide();
})
$(document).on("click", ".news-button", function(){
    $(".favorites").hide();
$(".news-stuff").show();
})
$(document).on("click", ".comment-button", function(){
    return $.ajax({
        url: "submit",
        type: "POST",
        data: $(".comment-entered").val().trim()
      }).then(function(data){
          console.log(data)
      })
})

console.log("helloall")
});
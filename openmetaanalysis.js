$(document).ready(function(){
  //Link handlers
  $(".main").click(function(event){
    event.preventDefault();
	window.location.href = "http://openmetaanalysis.github.io/" + $(this).attr("href")
  $(".repo").click(function(event){
    event.preventDefault();
	window.location.href = "http://github.com/" + $(this).attr("href")
  });
})
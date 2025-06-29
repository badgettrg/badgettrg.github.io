# This file is available at https://badgettrg.github.io/politics-money/
# Author:rbob.badgett@gmail.com
# Permissions:
#* Code GNU GPLv3 https://choosealicense.com/licenses/gpl-3.0/
#* Images CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
# Optimized for coding with R Studio document outline view
# Last edited 2025-06-26

#* Set working directory -----
if (Sys.getenv("RSTUDIO") != "1"){
  args <- commandArgs(trailingOnly = FALSE)
  script_path <- sub("--file=", "", args[grep("--file=", args)])  
  script_path <- dirname(script_path)
  setwd(script_path)
}else{
  setwd(dirname(rstudioapi::getSourceEditorContext()$path))
}
getwd()

# Functions ===============================
function_plot_print <- function (plotname, plotwidth, plotheight, imagetype='png') {
  
  #plotname <- gsub("[:\\s\n?!']", "", plotname)
  plotname <- gsub(":|\\s|\\n|\\?|\\!|\\'", "", plotname)
  
  current.date <- as.character(strftime(Sys.time(), format="%Y-%m-%d", tz="", usetz=FALSE))
  
  rstudioapi::savePlotAsImage(
    paste(plotname, ' -- ', current.date, '.', imagetype, sep=''),
    format = imagetype, width = plotwidth, height = plotheight)
}

# Data creation ===============================
data_ratings <- read.table(textConnection('
category,     Physicians,  Congress
2000s,        65,           16
2024,         53,           8
'), header=TRUE, sep=",",strip.white=TRUE)

# Convert the relevant columns to a matrix and transpose
ratings_matrix <- t(as.matrix(data_ratings[, c("Physicians", "Congress")]))

# Barplot =====================
par(mar=c(5.1+2,4.1,4.1-1.5,2.1), mfrow=c(1,1)) # (bottom, left, top, right)
barplot(ratings_matrix,
         beside = TRUE,
         col = c("green", "red"),
         names.arg = c("2000s", "2024"),
         ylim = c(0, 100),
         ylab = "Percent 'high' or 'very high'",
         #main = "",
         legend.text = c("Physicians", "Congressional Members"),
         args.legend = list(x = "topright", inset = 0.02))
box()
mtext("Trust in Physicians and Members of Congress", side = 3, line = 1, at = NA, adj = 0, font = 2, cex = 1.2, outer=FALSE)
text(x = c(1.5,4.5), y = data_ratings$Physicians+strheight("A"), paste0(data_ratings$Physicians,"%"))
text(x = c(2.5,5.5), y = data_ratings$Congress+strheight("A"), paste0(data_ratings$Congress,"%"))
# Add source text under plot
mtext("Sources:", side = 1, line = 2, adj = 0, at = 0, font = 2, outer=FALSE)
#mtext("Gallup. https://news.gallup.com/poll/655106/", side = 1, line = 3, cex = 0.8, at = 0, adj = 0, outer = FALSE)
#mtext("     americans-ratings-professions-stay-historically-low.aspx", side = 1, line = 4, cex = 0.8, at = 0, adj = 0,outer = FALSE)
mtext("Gallup. https://news.gallup.com/poll/655106/americans-ratings-professions-stay-historically-low.aspx", side = 1, line = 3, cex = 0.8, at = 0, adj = 0, outer = FALSE)
mtext("     ", side = 1, line = 3, cex = 0.8, at = 0, adj = 0,outer = FALSE)
mtext("     Percent rated 'honesty and ethical standards' as 'high' or 'very high'", side = 1, line = 4, cex = 0.8, at = 0, adj = 0,outer = FALSE)
mtext(paste0("bob.badgett@gmail.com, ", Sys.Date(), ", CC BY-NC-SA 4.0"), side = 1, line = 6, cex = 0.8, adj = 1, outer = FALSE)

function_plot_print('Money, dark - bar graph', 600,500)

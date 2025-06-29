# This file is available at https://badgettrg.github.io/politics-money/
# Author:rbob.badgett@gmail.com
# Permission: GNU GPLv3 https://choosealicense.com/licenses/gpl-3.0/
# Last edited 2025-06-28

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


### Data creation ===============================

data_media_use <- read.table(textConnection('
Site,         Fox,  WSJ, APNews, WaPo, NYT
GovTrack,     5,   1,   0,       2,   3
OpenSecrets, 7,   16,  13,      31, 55
VoteView,     2,   0,   0,       7,   1
'), header=TRUE, sep=",",strip.white=TRUE, row.names = 1)

matrix_media_use <- as.matrix(data_media_use)
chisq.test(data_media_use)
fisher.test(data_media_use)

$( document ).ajaxComplete(function() {
	//Background-color of cells
	});
$(document).ready(function(){
$("#header_pico").html("<p>Included studies, starting with the oldest.</p><table><caption>Diagnostic test accuracy studies of this topic</caption><tbody><tr><th>Trial</th><th>Subjects</th><th>Index test</th><th>Reference standard</th><th>Subject flow and timing</th><th style='width:7px;background-color:white;border: 1px solid white'></th></tr></table>");
var url = "/" + repo_dir + "/tables/pico.xml";
        $.ajax({
            type: "GET",
            url: url,
            cache: false,
            dataType: "xml",
            error: function() {
                alert("The XML File," + url + ", could not be processed correctly.");
                },
            success: function(xml) { 
			$(xml).find('study').each(function(){
				var citationtext = $(this).find('citation').text() + ', ' + $(this).find("citation").attr("year") +  '<br>' + $(this).find("citation").attr("journal_abbrev") + "<br>"
				if ( $(this).find('citation').attr('pmid')){
					if ( $(this).find('citation').attr('pmid').length > 4){
						citationtext += "PMID: <a href='http://pubmed.gov/" + $(this).find('citation').attr('pmid') + "'>" + $(this).find('citation').attr('pmid') + "</a><br>"
						}
					}
				if ( $(this).find('citation').attr('trialregistration')){
					if ( $(this).find('citation').attr('trialregistration').toLowerCase().indexOf("nct") >= 0){
						citationtext += "<a href='https://clinicaltrials.gov/ct2/show/study/" + $(this).find('citation').attr('trialregistration') + "'>" + $(this).find('citation').attr('trialregistration') + "</a><br>"
						}
					if ( $(this).find('citation').attr('trialregistration').toLowerCase().indexOf("isrctn") >= 0){
						citationtext += "<a href='http://www.isrctn.com/" + $(this).find('citation').attr('trialregistration') + "'>" + $(this).find('citation').attr('trialregistration') + "</a><br>"
						}
					}
				var patient_selection = $(this).find('patient_selection').attr('total') + ' subjects with ' + $(this).find('patient_selection').find('description').text();
					$(this).find('patient_selection').find('bullet').each(function(){
						patient_selection += '<br>&bull; ' + $(this).text()
						})
				var index_test = '';
					$(this).find('index_test').find('bullet').each(function(){
						index_test += '<br>&bull; ' + $(this).text()
						})
				index_test = $(this).find('index_test').find('bullet').remove().end().text() + index_test
				var reference_standard = '';
					$(this).find('reference_standard').find('bullet').each(function(){
						reference_standard += '<br>&bull; ' + $(this).text()
						})
				reference_standard = $(this).find('reference_standard').find('bullet').remove().end().text() + reference_standard
				var flow_timing = '';
					$(this).find('flow_timing').each(function(){
						$(this).find("bullet").each(function(){
						flow_timing += '<br>&bull; ' + $(this).text()
						})
					})
				flow_timing = $(this).find('flow_timing').find('bullet').remove().end().text() + flow_timing
                        	var pmid= $(this).find('citation').attr('pmid');
				var trHTML = '<tr><td>' +  citationtext + '</td><td>' + patient_selection + '</td><td>' + index_test + '</td><td>' + reference_standard + '</td><td>' + flow_timing + '</td></tr>';
				//PubMed links
				regex = /(\s{1,})(\d{7,})/ig; //from http://jsfiddle.net/badgettrg/60482cbh/
				trHTML = trHTML.replace(regex, "$1<a href='http://pubmed.gov/$2'>$2</a>");
				//Highlight emphasis
				regex = /\*{2}(.+)\*{2}/ig;
				trHTML = trHTML.replace(regex, "<span style='background-color:yellow;font-weight:bold;font-style:italic'>$1</span>");	
			        $('#citations').append(trHTML);
			})
                }
      });

	//Write footer
	//Reuse
	$("#business-pico").append("<div style='text-align:center'><a href='https://github.com/openMetaAnalysis/openMetaAnalysis.github.io/blob/master/reusing.MD'>Cite &amp; use this content</a></div>")
	//Edit and history
	$("#business-pico").append("<div style='text-align:center'>Source content: <a href='/" + repo_dir + "/tables/pico.xml'>view</a> - <a href='https://github.com/openMetaAnalysis/" + repo_dir + "/commits/gh-pages/tables/pico.xml'>history</a> - <a href='https://github.com/openMetaAnalysis/" + repo_dir + "/blob/gh-pages/tables/pico.xml'>edit</a> (Hint: use <a href=\"https://kobra.io\">Kobra</a> for collaborative editing)</div>")
	//Issues and comments
	$("#business-pico").append("<div style='text-align:center'><a href='https://github.com/openMetaAnalysis/" + repo_dir + "/issues?q=is%3Aopen+is%3Aissue'>Issues and comments</a></div>")

    });

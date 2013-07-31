$(document).ready(function() {
  var funderEntryCount = 0;
  var grantNumberEntryCounts = {};

  var makeSubsidiaryOptions = function(descendants, names) {
      var html = '<option>Select a sub-organization</option>';
      $.each(descendants, function(idx, d) {
	  html += '<option>' + names[d] + '</option>';
      });
      return html;
  };

  var addNewGrantNumber = function(funderEntryNumber) {
    grantNumberEntryCounts[funderEntryNumber] = grantNumberEntryCounts[funderEntryNumber] + 1;
    var cssPath = '.funder-entry.seq-' + funderEntryNumber + ' ';
    var $newEntry = $('.grant-number-entry.seq-0').first().clone();
    $newEntry.removeClass('seq-0').addClass('seq-' + grantNumberEntryCounts[funderEntryCount]);
    $newEntry.show();
    $(cssPath + '#grant-number-entries').append($newEntry);
  }

  var applyFunderEntryCallbacks = function(sequenceNumber) {
    var cssPath = '.funder-entry.seq-' + sequenceNumber + ' ';
    var events = 'typeahead:autocompleted typeahead:selected';

    $(cssPath + '#funder-name').typeahead({
      name: 'funders',
      remote: 'http://search.crossref.org/funders?descendants=true&q=%QUERY',
      template: '<p>{{value}} <span style="color: grey; font-size: 0.7em;">{{country}}</span></p>',
      engine: Hogan,
      limit: 16
    });

    $(cssPath + '#funder-name').bind(events, function(e, datum) {
      if (datum['descendants'].length > 1) {
	$(cssPath + '#subsidiary-select').html(makeSubsidiaryOptions(datum['descendants'], datum['descendant_names']));
	$(cssPath + '#subsidiary-list').show();
      } else {
	$(cssPath + '#subsidiary-select').html('');
        $(cssPath + '#subsidiary-list').hide();
      }
    });

    $(cssPath + '#add-grant-number-link').click(function(e) {
      addNewGrantNumber(sequenceNumber);
    });
  }

  var addNewFunder = function() {
    funderEntryCount = funderEntryCount + 1;
    var $newEntry = $('.funder-entry.seq-0').first().clone();
    $newEntry.removeClass('seq-0').addClass('seq-' + funderEntryCount);
    $newEntry.show();
    $('#funder-entries').append($newEntry);
    grantNumberEntryCounts[funderEntryCount] = 0;
    addNewGrantNumber(funderEntryCount);
    applyFunderEntryCallbacks(funderEntryCount);
  }

  $('#add-funder-link').click(function(e) {
    addNewFunder();
  });

  addNewFunder();

  $('#no-funder-checkbox').change(function(e) {
      if ($(this).is(':checked')) {
          $('#funder-information').hide();
      } else {
	  $('#funder-information').show();
      }
  });
});

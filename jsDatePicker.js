'use strict';
/*
*
*	JsDatePicker
*
*	Author : Maxime Marais
*
*/

function JsDatePicker(options) {

	this.options = {
		lang 				: 'EN',
		currentDate 		: null,
		monthLabels 		: [],
		dayLabels 			: [],
		todayLabel 			: '',
		container 			: null,
		dtContainer 		: null,
		dtContainerId 		: null,
		dtTableContainer    : null,
		dtTableHeadContainer: null,
		dtTableBodyContainer: null,
		dtTableFootContainer: null,
		dtHourContainer 	: null,
		dtPreviousMonth 	: null,
		dtToday 			: null,
		dtNextMonth 		: null,
		dtSelectMonth 		: null,
		dtSelectYear 		: null,
		currentMonth 		: null,
		currentYear			: null,
		selectedDayContainer: null,
		selectedDay 		: null,
		selectedMonth 		: null,
		selectedYear 		: null,
		yearMin 			: new Date().getFullYear(),  // Current -100
		yearMax 			: new Date().getFullYear()+5,  	// Current +5
    min           : null,
    max           : null,
		isInput 			: false,
		isShow 				: false,// Seulement utilisé pour les input
		closeOnSelect 		: false,
		clickOnDiv 			: false,
		disabledItems 		: {},
    disablePastDay : false,
		timepicker 			: false,
		minHour 			: 0,
		maxHour 			: 23,
		useTimeHalf 		: false,
		useTimeQuarter 		: false,
		selectedHourContainer: null,
		selectedHour 		: null,
		onChange 			: null
	};

	this.init(options);

	if (!this.options.isInput) {
		this.generateStructure();
	}

	return this;
}

JsDatePicker.prototype.I18N = {
	'EN' : {
		monthLabels : ['January', 'February', 'March', 'April','May', 'June', 'July', 'August', 'September','October', 'November', 'December'],
		dayLabels  	: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		todayLabel	: 'Today'
	},
	'FR' : {
		monthLabels : ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
		dayLabels 	: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
		todayLabel	: 'Aujourd\'hui'
	}
};

JsDatePicker.prototype.init = function(options) {

	var _ = this;


	for (var key in options) {
		if(_.options.hasOwnProperty(key) ) {
			_.options[key]= options[key];
		}
	}

	if (!_.options.currentMonth) {
		_.options.currentMonth = new Date().getMonth();
	}

	if (!_.options.currentYear) {
		_.options.currentYear = new Date().getFullYear();
	}

	if (!_.options.currentDate) {
		_.options.currentDate = new Date();
	}

	if (_.useTime() === true) {
		_.options.container.setAttribute('maxlength', 18);
		if (!_.options.currentHour){
			_.options.currentHour = _.options.currentDate.getHours();
			if (parseInt(_.options.currentHour) < 10){
				_.options.currentHour = '0'+_.options.currentHour;
			}
		}
		if (!_.options.currentMinutes){
			_.options.currentMinutes = _.options.currentDate.getMinutes();
			if (parseInt(_.options.currentMinutes) < 10){
				_.options.currentMinutes = '0'+_.options.currentMinutes;
			}
		}

	}

	if (_.options.monthLabels.length === 0) {
		//_.options.monthLabels = _.options.defaultMonthLabels;
		_.options.monthLabels = _.I18N[_.options.lang].monthLabels;
	}

	if (_.options.dayLabels.length === 0) {
		_.options.dayLabels = _.I18N[_.options.lang].dayLabels;
	}

	if (_.options.todayLabel.length === 0) {
		_.options.todayLabel = _.I18N[_.options.lang].todayLabel;
	}

	if (_.options.container.nodeName === 'INPUT') {
		_.options.isInput = true;

		_.prepareInputValue(_.options.container.value);

		_.bindInput();
	}


	return this;
};

JsDatePicker.prototype.getCurrentDate = function() {

	var _ = this;

	if (_.options.currentDate) {
		_.options.currentDate = new Date();
	}

	return _.options.currentDate;
};

JsDatePicker.prototype.getCurrentYear = function() {
	return parseInt(this.options.currentYear, 10);
};

JsDatePicker.prototype.getCurrentMonth = function() {
	return parseInt(this.options.currentMonth);
};

JsDatePicker.prototype.getCurrentMonthLabel = function() {
	return this.options.monthLabels[this.getCurrentMonth()];
};

JsDatePicker.prototype.getMonthLabel = function(month) {
	if (!month){
		month = 0;
	}
	return this.options.monthLabels[month];
};

JsDatePicker.prototype.getDayLabel = function(day) {
	return this.options.dayLabels[day] ? this.options.dayLabels[day] : '';

};

JsDatePicker.prototype.getSelectedDayContainer = function() {
	return this.options.selectedDayContainer;
};

JsDatePicker.prototype.getSelectedHourContainer = function() {
	return this.options.selectedHourContainer;
};

JsDatePicker.prototype.getSelectedDay = function() {
	return parseInt(this.options.selectedDay);
};

JsDatePicker.prototype.getSelectedMonth = function() {
	return parseInt(this.options.selectedMonth);
};

JsDatePicker.prototype.getSelectedYear = function() {
	return parseInt(this.options.selectedYear, 10);
};

JsDatePicker.prototype.generateSelectMonth = function() {

	this.options.dtSelectMonth = document.createElement('select');
	this.options.dtSelectMonth.className += 'dt-select-month';

	var select = '';
  var minMonth = 0;
  var maxMonth = this.options.monthLabels.length;
  
  if (this.options.min) {
    if (this.options.min.getFullYear() === this.options.max.getFullYear()) {
      minMonth = this.options.min.getMonth();
    } else {
      if (this.getCurrentYear() === this.options.min.getFullYear()) {
        minMonth = this.options.min.getMonth();
      } else {
        minMonth = 0;
      }
    }
  }
  
  if (this.options.max) {
    // On est sur la même année
    if (this.options.min.getFullYear() === this.options.max.getFullYear()) {
      maxMonth = this.options.max.getMonth()+1;
    } else {
      // On est sur est pas sur l'année max
      if (this.getCurrentYear() < this.options.max.getFullYear()) {
        maxMonth = 12;
      } else {
        maxMonth = this.options.max.getMonth()+1;
      }
    }
   
  }
  
  if (this.getCurrentMonth() < minMonth) {
    this.options.currentMonth = minMonth;
  }
  
  if (this.getCurrentMonth() > maxMonth) {
    this.options.currentMonth = maxMonth;
  }
  
  
	for (var i = minMonth; i < maxMonth; i++) {
		select += '<option value="'+i+'" '+(i === this.getCurrentMonth() ? 'selected="selected"' : '')+'>'+this.getMonthLabel(i)+'</option>';
	}

	this.options.dtSelectMonth.innerHTML = select;
  
  if (this.options.spanSelectMonth) {
    this.options.spanSelectMonth.innerHTML = '';
  } else {
    this.options.spanSelectMonth = document.createElement('span');
  }
  
  this.options.spanSelectMonth.className = 'dt-ctnr-select-month';
  this.options.spanSelectMonth.appendChild(this.options.dtSelectMonth);
  
	this.bindSelectMonth();

};

JsDatePicker.prototype.changeSelectMonth = function() {
	this.options.dtSelectMonth.value = parseInt(this.getCurrentMonth());
};

JsDatePicker.prototype.generateSelectYear = function() {

	this.options.dtSelectYear = document.createElement('select');
	this.options.dtSelectYear.className += 'dt-select-year';
  
  if (this.options.min) {
    this.options.yearMin = this.options.min.getFullYear();
  }
  
  if (this.options.max) {
    this.options.yearMax = this.options.max.getFullYear();
  }

	var select = '';
	for (var i = parseInt(this.options.yearMin); i <= parseInt(this.options.yearMax); i++) {
		select += '<option value="'+i+'" '+(i === parseInt(this.getCurrentYear()) ? 'selected="selected"' : '')+'>'+i+'</option>';
	}

	this.options.dtSelectYear.innerHTML = select;

  if (this.options.spanSelectYear) {
    this.options.spanSelectYear.innerHTML = '';
  } else {
    this.options.spanSelectYear = document.createElement('span');
  }
  
  this.options.spanSelectYear.className = 'dt-ctnr-select-year';
  this.options.spanSelectYear.appendChild(this.options.dtSelectYear);
  
	this.bindSelectYear();

};

JsDatePicker.prototype.changeSelectYear = function() {
	this.options.dtSelectYear.value = this.getCurrentYear();
  this.generateSelectMonth();
};

JsDatePicker.prototype.generateStructure = function() {
	var old = document.getElementById(this.options.dtContainerId);
	if (old) {
		old.remove();
	}

	this.options.dtContainer = document.createElement('div');
	this.options.dtContainerId =  'dt-'+Math.random().toString(36).substr(2, 9);
	this.options.dtContainer.setAttribute('id', this.options.dtContainerId);
	this.options.dtContainer.className += ' dt-container';

	this.options.dtTableContainer = document.createElement('table');
	this.options.dtTableContainer.className += 'dt-table';

	this.options.dtTableHeadContainer = document.createElement('thead');
	this.options.dtTableBodyContainer = document.createElement('tbody');
	this.options.dtTableFootContainer = document.createElement('tfoot');

	this.options.dtTableContainer.appendChild(this.options.dtTableHeadContainer);
	this.options.dtTableContainer.appendChild(this.options.dtTableBodyContainer);
	this.options.dtTableContainer.appendChild(this.options.dtTableFootContainer);
	this.options.dtContainer.appendChild(this.options.dtTableContainer);


	this.generateHeader();
	this.generateBody();
	this.generateFooter();

	if (!this.options.isInput) {
		this.options.container.innerHTML = '';
		this.options.container.appendChild(this.options.dtContainer);
	} else {

		this.options.dtContainer.style.position = 'absolute';

		var pos = this.getPosition(this.options.container);

		this.options.dtContainer.style.zIndex = '999';
		this.options.dtContainer.style.left = pos[0]+'px';
		this.options.dtContainer.style.top = (pos[1]+this.options.container.clientHeight+5)+'px';

		document.body.appendChild(this.options.dtContainer);
	}
	this.bindScroll();
};

JsDatePicker.prototype.generateHeader = function() {
	// Previous Month
	var tr = document.createElement('tr'),
		th = document.createElement('th');

	this.options.dtPreviousMonth = document.createElement('div');
	this.options.dtPreviousMonth.className = 'dt-nav dt-previous-month';
	this.options.dtPreviousMonth.innerHTML = '<';
	th.appendChild(this.options.dtPreviousMonth);
	tr.appendChild(th);

	// Select Month and Year
	this.generateSelectMonth();
	th = document.createElement('th');
	th.setAttribute('colspan', 5);
  this.generateSelectYear();
	th.appendChild(this.options.spanSelectYear);
	th.appendChild(this.options.spanSelectMonth);
  tr.appendChild(th);
	

	// Previous Month
	th = document.createElement('th');
	this.options.dtNextMonth = document.createElement('div');
	this.options.dtNextMonth.className = 'dt-nav dt-next-month';
	this.options.dtNextMonth.innerHTML = '>';
	th.appendChild(this.options.dtNextMonth);
	tr.appendChild(th);

	this.options.dtTableHeadContainer.appendChild(tr);

	this.bindNextMonth();
	this.bindPreviousMonth();

};

JsDatePicker.prototype.generateBody = function() {
	var tr = document.createElement('tr'),
		i;
	tr.className = 'dt-header';

	var html = '';
	for(i = 0; i <= 6; i++ ){
		var d = 0;
		if (i < 6) {
			d=i+1;
		} else {
			d = 0;
		}
		html += '<td class="dt-header-day">';
		html += this.getDayLabel(d);
		html += '</td>';
	}
	tr.innerHTML = html;

	if (this.useTime() === true) {

		this.options.dtHourContainer = document.createElement('td');
		this.options.dtHourContainer.setAttribute('rowspan', 6);
		this.options.dtHourContainer.className = 'dt-hour-container';
	 	html = '<ul>';
	 	var hourValue = '';
	 	for (i = this.options.minHour; i <= this.options.maxHour; i++) {
	 		hourValue = (i > 9 ? '' : '0')+i+':00';
	 		html += '<li class="dt-hour '+(this.options.selectedHour !== hourValue ? '' : 'dt-hour-selected')+'" data-value="'+hourValue+'">'+(i > 9 ? '' : '0')+i+':00'+'</li>';

			if (i < this.options.maxHour) {
		 		if (this.options.useTimeQuarter) {
		 			for (var j = 15; j <= 45; j += 15) {
		 				hourValue = (i > 9 ? '' : '0')+i+':'+j;
		 				html += '<li class="dt-hour '+(this.options.selectedHour !== hourValue ? '' : 'dt-hour-selected')+'" data-value="'+hourValue+'">'+(i > 9 ? '' : '0')+i+':'+j+'</li>';
		 			}
		 		}else if (this.options.useTimeHalf) {
		 			hourValue = (i > 9 ? '' : '0')+i+':30';
		 			html += '<li class="dt-hour '+(this.options.selectedHour !== hourValue ? '' : 'dt-hour-selected')+'" data-value="'+hourValue+'">'+(i > 9 ? '' : '0')+i+':30'+'</li>';
		 		}
			}
	 	}
	 	html += '</ul>';

	 	this.options.dtHourContainer.innerHTML = html;

	 	tr.appendChild(this.options.dtHourContainer);
	}


	this.options.dtTableBodyContainer.appendChild(tr);

	if (this.useTime() === true) {
		this.initTimePosition();
		this.bindTime();
	}

	this.generateDayHTML();
};

JsDatePicker.prototype.initTimePosition = function() {
	if (this.options.selectedHour) {

		var elem = this.options.dtHourContainer.querySelector('li[data-value="'+this.options.selectedHour+'"]');
		if (elem) {
			var _ = this;
			setTimeout(function(){
				_.options.dtHourContainer.querySelector('ul').scrollTop = elem.offsetTop;
			},1);
		}
	}
};

JsDatePicker.prototype.setTimeSelected = function() {

	var selected = this.options.dtHourContainer.querySelectorAll('li.dt-hour-selected');
	for (var i = 0; i < selected.length; i++) {
		selected[i].className = selected[i].className.replace(' dt-hour-selected', '');
	}

	if (this.options.selectedHour) {

		var elem = this.options.dtHourContainer.querySelector('li[data-value="'+this.options.selectedHour+'"]');
		if (elem) {
			elem.className += ' dt-hour-selected';
			this.initTimePosition();
		}
	}
};

JsDatePicker.prototype.generateFooter = function() {
	var tr = document.createElement('tr'),
		td = document.createElement('td');

	td.setAttribute('colspan', 7);
	this.options.dtToday = document.createElement('div');
	this.options.dtToday.className = 'dt-today';
	this.options.dtToday.innerHTML = this.options.todayLabel;

	td.appendChild(this.options.dtToday);
	tr.appendChild(td);
	this.options.dtTableFootContainer.appendChild(tr);

	this.bindToday();
};

JsDatePicker.prototype.generateDayHTML = function() {

	var _ 			= this,
		firstDay 	= new Date(_.getCurrentYear(), _.getCurrentMonth(), 1),
		startingDay = firstDay.getDay(),
		monthLength = new Date(_.getCurrentYear(), _.getCurrentMonth()+1, 0).getDate();

	_.changeSelectMonth();
	_.changeSelectYear();

	var today 		= _.getCurrentDate(),
		todayDay 	= today.getDate(),
		todayMonth 	= today.getMonth(),
		isToday 	= false,
		day = 1,
		isDayOfMonth = false,
		tr = null,
		td = null,
		i;


	var dtTrDay = _.options.dtTableBodyContainer.querySelectorAll('.dt-tr-day');
	if (dtTrDay) {
		for (i = 0; i < dtTrDay.length; i++) {
			dtTrDay[i].remove();
		}
	}
	// Ligne
	for (i = 0; i < 9; i++) {

		tr = document.createElement('tr');
		tr.className = 'dt-tr-day';
		// Colonne
	    for (var j = 0; j <= 6; j++) {

	    	var realDayIndex = j,
	    		dayIndex 	 = j+1;

	    	var enabled = 'enabled';
	    	if (_.isDisabledItem(dayIndex, day)) {
	    		enabled = 'disabled';
	    	}

    		isToday = false;
			if (day === todayDay && _.getCurrentMonth() === todayMonth) {
				isToday = true;
			}

			var isSelected = false;

			if ( _.getSelectedDay() === day && _.getSelectedMonth() === _.getCurrentMonth() && _.getSelectedYear() === _.getCurrentYear()) {
				isSelected = true;
			}

			isDayOfMonth = false;
			if (day <= monthLength && (i > 0 || (startingDay != 0 && dayIndex >= startingDay) || (startingDay == 0 && realDayIndex == 6) )) {
				isDayOfMonth = true;
			}
     
      if (_.options.disablePastDay === true && new Date(_.getCurrentYear(), _.getCurrentMonth(), day, 23, 59, 59).getTime() < new Date().getTime(null, null, null, 0, 0, 0)) {
        enabled = 'disabled';
      }
     
			td = document.createElement('td');

			td.className = enabled+' '+(isDayOfMonth ? 'dt-day' : '')+' '+(isToday ? 'dt-current' : '')+' '+(isSelected ? 'dt-selected' : '');
			td.setAttribute('data-day', day);
			if (isDayOfMonth) {
	        	td.innerHTML = '<span>'+day+'</span>';
	        	day++;
	      	}

	      	if (isSelected) {
	      		_.options.selectedDayContainer = td;
	      	}

	      	tr.appendChild(td);
	    }
	    _.options.dtTableBodyContainer.appendChild(tr);

	    if (day > monthLength) {
	      	break;
	    }
	}

	_.bindDay();

};

JsDatePicker.prototype.getPosition = function(element) {

	var left 	= 0,
		top 	= 0,
		e 		= element;

	while (e.offsetParent !== undefined && e.offsetParent !== null) {
		left += e.offsetLeft + (e.clientLeft !== null ? e.clientLeft : 0);
		top += e.offsetTop + (e.clientTop !== null ? e.clientTop : 0);
		e = e.offsetParent;
	}

	return [left,top];
};

JsDatePicker.prototype.bindNextMonth = function() {

	var _ = this,
		nextMonth = _.options.dtContainer.querySelector('.dt-next-month');

	nextMonth.addEventListener('click', function(e) {
		e.preventDefault();
		_.clickOnNextMonth();
	}, false);
};

JsDatePicker.prototype.clickOnNextMonth = function() {

	var _ = this;
  
  var minMonth = 0;
  var minYear = this.options.yearMin;
  if (this.options.min) {
    minMonth = this.options.min.getMonth();
    minYear = this.options.min.getFullYear();
  }
  
  var maxMonth = 11;
  var maxYear = this.options.yearMax;
  if (this.options.max) {
    maxMonth = this.options.max.getMonth();
    maxYear = this.options.max.getFullYear();
  }
  
  if (_.getCurrentMonth() >= maxMonth && _.options.currentYear >= maxYear) {
    return;
  }

	if (_.getCurrentMonth() < 11) {
		_.options.currentMonth++;
	} else {
		_.options.currentMonth = 0;
		_.options.currentYear++;
	}

	_.generateDayHTML();
};


JsDatePicker.prototype.bindPreviousMonth = function() {

	var _ = this,
		previousMonth = _.options.dtContainer.querySelector('.dt-previous-month');

	previousMonth.addEventListener('click', function(e) {
		e.preventDefault();
		_.clickOnPreviousMonth();
	}, false);
};

JsDatePicker.prototype.clickOnPreviousMonth = function() {

	var _ = this;

  var minMonth = 0;
  var minYear = this.options.yearMin;
  if (this.options.min) {
    minMonth = this.options.min.getMonth();
    minYear = this.options.min.getFullYear();
  }
  
  var maxMonth = 11;
  var maxYear = this.options.yearMax;
  if (this.options.max) {
    maxMonth = this.options.max.getMonth();
    maxYear = this.options.max.getFullYear();
  }
  
  if (_.getCurrentMonth() <= minMonth && _.options.currentYear <= minYear) {
    return;
  }
  
	if (_.getCurrentMonth() > minMonth) {
		_.options.currentMonth--;
	} else {
		_.options.currentMonth = 11;
		_.options.currentYear--;
	}

	_.generateDayHTML();

};

JsDatePicker.prototype.bindSelectMonth = function() {
	var _ = this;

	this.options.dtSelectMonth.addEventListener('change', function(e) {
		e.preventDefault();
		_.onChangeSelectMonth(this);
	}, false);
};

JsDatePicker.prototype.onChangeSelectMonth = function(selectMonth) {
	this.options.currentMonth = parseInt(selectMonth.value);
	this.generateDayHTML();
};

JsDatePicker.prototype.bindSelectYear = function() {
	var _ = this;

	this.options.dtSelectYear.addEventListener('change', function(e) {
		e.preventDefault();
		_.onChangeSelectYear(this);
	}, false);
};

JsDatePicker.prototype.onChangeSelectYear = function(selectYear) {
	this.options.currentYear = selectYear.value;
	this.generateDayHTML();
};

JsDatePicker.prototype.bindToday = function() {

	var _ = this;

	this.options.dtToday.addEventListener('click', function(e) {
		e.preventDefault();
		_.clickOnToday();
	}, false);
};

JsDatePicker.prototype.bindScroll = function() {

	var _ = this;

	_.options.dtTableBodyContainer.addEventListener('mousewheel', function(e) {

    	var target = e.target;

    	while( target){
    		if (target.nodeName === 'TBODY') {
    			break;
    		}
			if( target.className.indexOf('dt-hour-container') >= 0) {
				return;
			}
			target = target.parentNode;
		}
    	e.stopImmediatePropagation();
    	e.preventDefault();

		if (e.deltaY > 0) {
			_.clickOnNextMonth();

		} else {
			_.clickOnPreviousMonth();
		}

		return false;

	}, false);
};

JsDatePicker.prototype.useTime = function() {
	return this.options.timepicker;
};


JsDatePicker.prototype.clickOnToday = function() {
	var _ = this,
		date = new Date();

	_.options.currentMonth = date.getMonth();
	_.options.currentYear  = date.getFullYear();

	if (_.useTime() === true) {
		_.options.currentHour 		= date.getHours();
		_.options.currentMinutes 	= date.getMinutes();
	}

	_.generateDayHTML();

};

JsDatePicker.prototype.bindDay = function() {

	var _ = this,
		days = _.options.dtTableBodyContainer.querySelectorAll('.dt-day.enabled'),
		clickOnDay = function(e) {
			e.stopImmediatePropagation();
			e.preventDefault();
			_.clickOnDay(this);
		};

	for (var i = 0, iLen = days.length; i < iLen; i++) {
		if (days[i].addEventListener) {
			days[i].addEventListener('click', clickOnDay, false);
		}
	}

};

JsDatePicker.prototype.clickOnDay = function(day) {
	var _ = this,
		daySelected = null;

	if (_.getSelectedDayContainer()) {
		daySelected = _.options.dtTableBodyContainer.querySelectorAll('.dt-selected');
		for (var i=0; i<daySelected.length; i++){
			daySelected[i].className = daySelected[i].className.replace(' dt-selected', '');
		}
	}
	_.options.selectedDayContainer = day;
	_.options.selectedDay 		= day.getAttribute('data-day');
	_.options.selectedMonth 	= parseInt(_.options.currentMonth);
	_.options.selectedYear 		= _.options.currentYear;

	_.options.selectedDayContainer.className += ' dt-selected';
	_.selectedDayToString();

	if (_.options.onChange) {
		_.options.onChange(this.options.container);
	}

	if (_.options.closeOnSelect && !_.useTime()) {
		_.remove();
	}

};

JsDatePicker.prototype.isNumeric = function(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};

JsDatePicker.prototype.clickOnHour = function(hour) {
	var _ 				= this,
		hourSelected 	= null;


	hourSelected = _.options.dtHourContainer.querySelectorAll('.dt-hour-selected');
	for (var i=0; i<hourSelected.length; i++){
		hourSelected[i].className = hourSelected[i].className.replace(' dt-hour-selected', '');
	}
	_.options.selectedHourContainer = hour;
	_.options.selectedHourContainer.className += ' dt-hour-selected';

	_.options.currentHour  		= _.options.selectedHourContainer.getAttribute('data-value').split(':')[0];
	_.options.currentMinutes  	= _.options.selectedHourContainer.getAttribute('data-value').split(':')[1];
	_.options.selectedHour 		= _.options.selectedHourContainer.getAttribute('data-value');


	_.selectedDayToString();

	if (_.options.onChange) {
		_.options.onChange(this.options.container);
	}

	if (_.options.closeOnSelect) {
		_.remove();
	}
};

JsDatePicker.prototype.bindTime = function() {
	var _ = this,
		hours = _.options.dtTableBodyContainer.querySelectorAll('.dt-hour'),
		clickHour = function(e) {
			e.preventDefault();
			_.clickOnHour(this);
		};

	for (var i = 0; i < hours.length; i++) {
		hours[i].addEventListener('click', clickHour, false);
	}

};

JsDatePicker.prototype.selectedDayToString = function() {

	var _ 			= this,
		d 			= '',
		m 			= '',
		y 			= '',
		toString 	= '';

	if (_.getSelectedDayContainer() && _.getSelectedDayContainer().getAttribute) {
		d = parseInt(_.getSelectedDayContainer().getAttribute('data-day'));
		m = _.options.selectedMonth+1;
		y = _.getSelectedYear();
	} else {
		d = _.getSelectedDay() || _.options.currentDate.getDate();
		m = (_.getSelectedMonth() ? _.getSelectedMonth()+1 :  _.options.currentMonth+1);
		y = _.getSelectedYear() || _.options.currentYear;
	}

	if (parseInt(d) < 10 ) {
		d = '0'+d;
	}

	if (m< 10) {
		m = '0'+m;
	}

	toString = d+'/'+m+'/'+y;


	if (_.useTime()) {
		toString += ' '+_.options.selectedHour;
	}

	if (_.options.isInput) {
		_.options.container.value = toString;
	}

	return toString;
};

JsDatePicker.prototype.bindInput = function() {

	var _ = this;

	_.options.container.addEventListener('focus', function() {
		_.options.isShow = true;
		_.prepareInputValue(this.value);
		_.generateStructure();
	}, false);

	_.options.container.addEventListener('blur', function() {
		if (_.options.onChange) {
			_.options.onChange(_.options.container);
		}
	});

	_.options.container.addEventListener('keyup', function() {

        var value 	= _.options.container.value;

        if (_.prepareInputValue(value)){
        	if (!_.options.dtContainer){
            	_.generateStructure();
        	} else {
        		_.generateDayHTML();
        		if (_.useTime()) {
        			_.setTimeSelected();
        		}
        	}

        }

	});

	document.addEventListener('mousedown', function(e) {

		var target = e.target;

		_.options.clickOnDiv = false;


		while( target && !_.options.clickOnDiv){
			if( target.id === _.options.dtContainerId || target === _.options.container) {
				_.options.clickOnDiv = true;
			}
			target = target.parentNode;
		}
		if(!_.options.clickOnDiv && _.options.isShow){
			_.remove();
		}

	});

};

JsDatePicker.prototype.prepareInputValue = function(value) {

	var _ 		= this,
		splitedAll = value.split(' '),
		splitedDate = splitedAll[0].split('/'),
		change 	= false,
		edit 	= false;


  	if (splitedDate.length > 0) {

    	// On change le jour
    	if (splitedDate[0] && !isNaN(splitedDate[0])) {
    		_.options.selectedDay = (splitedDate[0] !== '00' ? splitedDate[0] : new Date().getDate());
    		change = true;
    	}

    	// on change le mois
    	if (splitedDate[1] && splitedDate[1] > 0 && splitedDate[1] <= 12 && !isNaN(splitedDate[1])) {
    		if (splitedDate[1] === '00') {
    			splitedDate[1] = new Date().getMonth();
    			edit = true;
    		}
    		_.options.selectedMonth = splitedDate[1]-1;
    		_.options.currentMonth  = parseInt(splitedDate[1])-1;
    		change = true;
    	}

    	// on change l'année
    	if (splitedDate[2] && !isNaN(splitedDate[2])) {
    		if (splitedDate[2] === '0000'){
    			var year = new Date().getFullYear();
    			splitedDate[2] = year;
    			edit = true;
    		}
    		_.options.selectedYear 	= splitedDate[2];
    		_.options.currentYear 	= splitedDate[2];
    		change = true;
    	}
    }

    if (_.useTime() === true) {

		if (splitedAll[1]) {
			var splitedTime = splitedAll[1].split(':');
			_.options.currentHour = splitedTime[0];
			if (parseInt(_.options.currentHour) > 23) {
				_.options.currentHour = 23;
			}
			if (parseInt(_.options.currentHour) < 0){
				_.options.currentHour = 0;
			}

			_.options.currentMinutes = splitedTime[1];
			if (parseInt(_.options.currentMinutes) > 59) {
				_.options.currentMinutes = 59;
			}
			if (parseInt(_.options.currentMinutes) < 0){
				_.options.currentMinutes = 0;
			}

			change = true;

		}

		if (isNaN(_.options.currentHour) || isNaN(_.options.currentMinutes)) {

			var d = new Date();
			_.options.currentHour = d.getHours();
			_.options.currentMinutes = d.getMinutes();
			change = true;
		}

		_.options.selectedHour = _.options.currentHour+':'+_.options.currentMinutes;

    }

    if (edit) {
    	_.options.container.value = _.selectedDayToString();
    }
    return change;
};

JsDatePicker.prototype.isDisabledItem = function(dayIndex, dayDate) {

	var _ 	= this,
		ret = false;

	if (dayIndex && _.options.disabledItems.days) {

		ret = _.isDisabledDay(dayIndex);

	}

	if (!ret && _.options.disabledItems.dates && dayDate) {
		var d = dayDate+'/'+((_.getCurrentMonth()+1) < 10 ? '0' : '')+(_.getCurrentMonth()+1)+'/'+_.getCurrentYear();

		ret = _.isDisabledDate(d);
	}


	return ret;
};

JsDatePicker.prototype.isDisabledDay = function(day) {

	var _ = this;

	if (_.options.disabledItems.days.length > 0) {
		day = parseInt(day);
		if (day === 0 && _.options.disabledItems.days.indexOf('sunday') >= 0) {
			return true;
		} else if (day === 1 && _.options.disabledItems.days.indexOf('monday') >= 0) {
			return true;
		} else if (day === 2 && _.options.disabledItems.days.indexOf('tuesday') >= 0) {
			return true;
		} else if (day === 3 && _.options.disabledItems.days.indexOf('wednesday') >= 0) {
			return true;
		} else if (day === 4 && _.options.disabledItems.days.indexOf('thursday') >= 0) {
			return true;
		} else if (day === 5 && _.options.disabledItems.days.indexOf('friday') >= 0) {
			return true;
		} else if (day === 6 && _.options.disabledItems.days.indexOf('saturday') >= 0) {
			return true;
		}

	}

	return false;

};
JsDatePicker.prototype.isDisabledDate = function(date) {

	var _ = this;

	if (_.options.disabledItems.dates.indexOf(date) >= 0) {
			return true;
	}

	return false;

};

JsDatePicker.prototype.remove = function() {

	var _ = this;

	_.options.isShow = false;
	_.options.dtContainer.remove();
	_.options.dtContainer = null;
};

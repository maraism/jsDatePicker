'use strict';
/*
*
*	jsDatePicker
*
*	Author : Maxime Marais
*
*/

function jsDatePicker(options) {

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
		yearMin 			: 100, // Current -100
		yearMax 			: 5, // Current +5
		isInput 			: false,
		isShow 				: false, // Seulement utilisé pour les input
		closeOnSelect 		: false,
		clickOnDiv 			: false,
		disabledItems 		: {},
		timepicker 			: false,
		currentHour 		: null,
		currentMinutes 		: null,
		onChange 			: null
	};

	this.init(options);

	if (!this.options.isInput) {
		this.generateStructure();
	}

	return this;
};

jsDatePicker.prototype.I18N = {
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

jsDatePicker.prototype.init = function(options) {

	var _ = this;


	for (var key in options) { 
		if(_.options.hasOwnProperty(key) ) {
			_.options[key]= options[key]
		};
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

	if (_.options.monthLabels.length == 0) {
		//_.options.monthLabels = _.options.defaultMonthLabels;
		_.options.monthLabels = _.I18N[_.options.lang].monthLabels;
	}

	if (_.options.dayLabels.length == 0) {
		_.options.dayLabels = _.I18N[_.options.lang].dayLabels;
	}
	
	if (_.options.todayLabel.length == 0) {
		_.options.todayLabel = _.I18N[_.options.lang].todayLabel;
	}

	if (_.options.container.nodeName == 'INPUT') {
		_.options.isInput = true;

		_.prepareInputValue(_.options.container.value);
	
		_.bindInput();
	}


	return this;
};

jsDatePicker.prototype.getCurrentDate = function() {

	var _ = this;

	if (_.options.currentDate) {
		_.options.currentDate = new Date();
	}

	return _.options.currentDate
};

jsDatePicker.prototype.getCurrentYear = function() {
	return this.options.currentYear;
};

jsDatePicker.prototype.getCurrentMonth = function() {
	return this.options.currentMonth;
};

jsDatePicker.prototype.getCurrentMonthLabel = function() {
	return this.options.monthLabels[this.getCurrentMonth()];
};

jsDatePicker.prototype.getMonthLabel = function(month) {
	if (!month)
		month = 0;
	return this.options.monthLabels[month];
};

jsDatePicker.prototype.getDayLabel = function(day) {
	return this.options.dayLabels[day] ? this.options.dayLabels[day] : '';

};

jsDatePicker.prototype.getSelectedDayContainer = function() {
	return this.options.selectedDayContainer;
};

jsDatePicker.prototype.getSelectedDay = function() {
	return this.options.selectedDay;
};

jsDatePicker.prototype.getSelectedMonth = function() {
	return this.options.selectedMonth;
};

jsDatePicker.prototype.getSelectedYear = function() {
	return this.options.selectedYear;
};

jsDatePicker.prototype.generateSelectMonth = function() {

	this.options.dtSelectMonth = document.createElement('select');
	this.options.dtSelectMonth.className += 'dt-select-month';
	
	var select = '';
	for (var i = 0; i < this.options.monthLabels.length; i++) {
		select += '<option value="'+i+'" '+(i == this.getCurrentMonth() ? 'selected="selected"' : '')+'>'+this.getMonthLabel(i)+'</option>';
	}
	
	this.options.dtSelectMonth.innerHTML = select;
	this.bindSelectMonth();
	
};

jsDatePicker.prototype.changeSelectMonth = function() {
	this.options.dtSelectMonth.value = this.getCurrentMonth();
};

jsDatePicker.prototype.generateSelectYear = function() {

	this.options.dtSelectYear = document.createElement('select');
	this.options.dtSelectYear.className += 'dt-select-year'; 
	
	var select = '';
	for (var i = parseInt(this.getCurrentYear())-this.options.yearMin; i <= parseInt(this.getCurrentYear())+this.options.yearMax; i++) {
		select += '<option value="'+i+'" '+(i == parseInt(this.getCurrentYear()) ? 'selected="selected"' : '')+'>'+i+'</option>';
	}
	
	this.options.dtSelectYear.innerHTML = select;
	this.bindSelectYear();
	
};

jsDatePicker.prototype.changeSelectYear = function() {
	this.options.dtSelectYear.value = this.getCurrentYear();
};

jsDatePicker.prototype.generateStructure = function() {
	
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

jsDatePicker.prototype.generateHeader = function() {
	
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
	th.appendChild(this.options.dtSelectMonth);
	this.generateSelectYear();
	th.appendChild(this.options.dtSelectYear);
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

jsDatePicker.prototype.generateBody = function() {
	this.generateHTML();
};

jsDatePicker.prototype.generateFooter = function() {
	
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

jsDatePicker.prototype.generateHTML = function() {

	var _ 			= this,
		firstDay 	= new Date(_.getCurrentYear(), _.getCurrentMonth(), 1),
		startingDay = firstDay.getDay(),
		monthLength = new Date(_.getCurrentYear(), _.getCurrentMonth()+1, 0).getDate(),
		monthName 	= _.getCurrentMonthLabel();
	
	_.changeSelectMonth();
	_.changeSelectYear();

	var html = '<tr class="dt-header">';

	var today 		= _.getCurrentDate(),
		todayDay 	= today.getDate(),
		todayMonth 	= today.getMonth(),
		isToday 	= false;

	for(var i = 0; i <= 6; i++ ){
		html += '<td class="dt-header-day">';
		html += _.getDayLabel(i);
		html += '</td>';
	}
	html += '</tr><tr>';

	var day = 1,
		isDayOfMonth = false;
	// Ligne
	for (var i = 0; i < 9; i++) {
		// Colonne
	    for (var j = 0; j <= 6; j++) { 

	    	var enabled = 'enabled';
	    	if (_.isDisabledItem(j, day))
	    		enabled = 'disabled';

    		isToday = false;
			if (day == todayDay && _.getCurrentMonth() == todayMonth)
				isToday = true;

			var isSelected = false;
			if ( _.getSelectedDay() == day && _.getSelectedMonth() == _.getCurrentMonth() && _.getSelectedYear() == _.getCurrentYear())
				isSelected = true;

			isDayOfMonth = false;
			if (day <= monthLength && (i > 0 || j >= startingDay))
				isDayOfMonth = true;

			var tdDay = '<td class="'+enabled+' '+(isDayOfMonth ? 'dt-day' : '')+' '+(isToday ? 'dt-current' : '')+' '+(isSelected ? 'dt-selected' : '')+'" data-day="'+day+'">';
			if (isDayOfMonth) {
	        	tdDay += '<span>'+day+'</span>';
	        	day++;
	      	}
	      	tdDay += '</td>';

	      	if (isSelected)
	      		_.options.selectedDayContainer = tdDay;
	     
	      	html += tdDay;
	    }
	    if (day > monthLength) {
	      	break;
	    } else {
	      	html += '</tr><tr>';
	    }
	}
	
	html += '</tr>';
	
	if (_.useTime() === true) {
		html += '<tr><td colspan="7"><div class="dt-time-container"><span class="dt-time-text">Heure : </span><input type="number" value="'+_.options.currentHour+'" class="dt-time-hour" maxlength="2" max="23" min="0"/><span class="dt-time-separator">:</span><input type="number" value="'+_.options.currentMinutes+'" class="dt-time-minutes" maxlength="2" max="59" min="0"/></div></td></tr>';
	}
	
	
	_.options.dtTableBodyContainer.innerHTML = html;
	
	

	_.bindDay();
	if (_.useTime() === true) {
		_.bindTime();
	}
	
	
};

jsDatePicker.prototype.getPosition = function(element) {

	var _ 		= this,
		left 	= 0, 
		top 	= 0,
		e 		= element;

	while (e.offsetParent != undefined && e.offsetParent != null) {
		left += e.offsetLeft + (e.clientLeft != null ? e.clientLeft : 0);
		top += e.offsetTop + (e.clientTop != null ? e.clientTop : 0);
		e = e.offsetParent;
	}

	return [left,top];
};

jsDatePicker.prototype.bindNextMonth = function() {

	var _ = this,
		nextMonth = _.options.dtContainer.querySelector('.dt-next-month');

	nextMonth.addEventListener('click', function(e) {
		e.preventDefault();
		_.clickOnNextMonth(this);
	}, false);
};

jsDatePicker.prototype.clickOnNextMonth = function(nextMonth) {
	
	var _ = this;

	if (_.getCurrentMonth() < 11) {
		_.options.currentMonth++;
	} else {
		_.options.currentMonth = 0;
		_.options.currentYear++;
	}

	_.generateBody();
};


jsDatePicker.prototype.bindPreviousMonth = function() {

	var _ = this,
		previousMonth = _.options.dtContainer.querySelector('.dt-previous-month');

	previousMonth.addEventListener('click', function(e) {
		e.preventDefault();
		_.clickOnPreviousMonth(this);
	}, false);
};

jsDatePicker.prototype.clickOnPreviousMonth = function(previousMonth) {
	
	var _ = this;

	if (_.getCurrentMonth() > 0) {
		_.options.currentMonth--;
	} else {
		_.options.currentMonth = 11;
		_.options.currentYear--;
	}

	_.generateBody();

};

jsDatePicker.prototype.bindSelectMonth = function() {
	
	var _ = this;

	this.options.dtSelectMonth.addEventListener('change', function(e) {
		e.preventDefault();
		_.onChangeSelectMonth(this);
	}, false);
};

jsDatePicker.prototype.onChangeSelectMonth = function(selectMonth) {
	this.options.currentMonth = selectMonth.value;
	this.generateBody();
};

jsDatePicker.prototype.bindSelectYear = function() {
	
	var _ = this;

	this.options.dtSelectYear.addEventListener('change', function(e) {
		e.preventDefault();
		_.onChangeSelectYear(this);
	}, false);
};

jsDatePicker.prototype.onChangeSelectYear = function(selectYear) {
	this.options.currentYear = selectYear.value;
	this.generateBody();
};

jsDatePicker.prototype.bindToday = function() {

	var _ = this

	this.options.dtToday.addEventListener('click', function(e) {
		e.preventDefault();
		_.clickOnToday(this);
	}, false);
};

jsDatePicker.prototype.bindScroll = function() {

	var _ = this;
	
	
	_.options.dtTableBodyContainer.addEventListener('mousewheel', function(e) {
		
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

jsDatePicker.prototype.useTime = function() {
	return this.options.timepicker;
};

jsDatePicker.prototype.clickOnToday = function(previousMonth) {
	
	var _ = this,
		date = new Date();

	_.options.currentMonth = date.getMonth();
	_.options.currentYear  = date.getFullYear();
	
	if (_.useTime() === true) {
		_.options.currentHour 		= date.getHours();
		_.options.currentMinutes 	= date.getMinutes();
	}

	_.generateHTML();

};

jsDatePicker.prototype.bindDay = function() {

	var _ = this,
		days = _.options.dtTableBodyContainer.querySelectorAll('.dt-day.enabled');

	for (var key in days) {
		if (days[key].addEventListener) {
			days[key].addEventListener('click', function(e){
				e.stopImmediatePropagation();
				e.preventDefault();
				_.clickOnDay(this);
			}, false);
		}
	}
	
};

jsDatePicker.prototype.clickOnDay = function(day) {
	
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
	_.options.selectedMonth 	= _.options.currentMonth;
	_.options.selectedYear 		= _.options.currentYear;

	_.options.selectedDayContainer.className += ' dt-selected';
	_.selectedDayToString();
	
	if (_.options.onChange) {
		_.options.onChange(this.options.container);
	}
	
	if (_.options.closeOnSelect) {
		_.remove();
	}
	
};

jsDatePicker.prototype.isNumeric = function(n) {
	return !isNaN(parseFloat(n)) && isFinite(n); 
};

jsDatePicker.prototype.bindTime = function() {
	
	var _ = this,
		inputHour = _.options.dtContainer.querySelector('.dt-time-hour'),
		inputMinutes = _.options.dtContainer.querySelector('.dt-time-minutes');
	
	inputHour.addEventListener('keyup', function(e) {
		
		if (!_.isNumeric(this.value) && this.value.length > 0){
			this.value = new Date().getHours();
		}
		
		if (parseInt(this.value) > 23)
			this.value = 23;
		else if (parseInt(this.value) < 0) {
			this.value = 0;
		}
		
		if (this.value.length > 0) {
			_.options.currentHour = this.value;
			_.selectedDayToString();
		}
	});
	
	inputMinutes.addEventListener('keyup', function(e) {
		
		if (!_.isNumeric(this.value) && this.value.length > 0){
			this.value = new Date().getMinutes();
		}
		
		if (parseInt(this.value) > 59)
			this.value = 59;
		else if (parseInt(this.value) < 0) {
			this.value = 0;
		}
		
		if (this.value.length > 0) {
			_.options.currentMinutes = this.value;
			_.selectedDayToString();
		}
	});
};

jsDatePicker.prototype.selectedDayToString = function() {

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
		m = (_.getSelectedMonth() ? _.getSelectedMonth()+1 :  _.options.currentMonth);
		y = _.getSelectedYear() || _.options.currentYear;
	}
	
	if (parseInt(d) < 10 )
		d = '0'+d;

	if (m< 10)
		m = '0'+m;
		
	toString = d+'/'+m+'/'+y;

			
	if (_.useTime()) {
		toString += ' - '+(_.options.currentHour < 10 ? '0' : '')+ parseInt(_.options.currentHour)+':'+(_.options.currentMinutes < 10 ? '0' : '')+parseInt(_.options.currentMinutes);
	}

	if (_.options.isInput) {
		_.options.container.value = toString;
	}

	return toString;
};

jsDatePicker.prototype.bindInput = function() {

	var _ = this;
	
	_.options.container.addEventListener('focus', function() {
		_.options.isShow = true;
		_.prepareInputValue(this.value);
		_.generateStructure();
	}, false);

	_.options.container.addEventListener('blur', function(e) {

	});

	_.options.container.addEventListener('keyup', function(e) {
		
        var value 	= _.options.container.value;
        	
        if (_.prepareInputValue(value))
            _.generateStructure();
                
	});

	document.addEventListener('mousedown', function(e) {

		var target = e.target;
		
		_.options.clickOnDiv = false;

			
		while( target && !_.options.clickOnDiv){
			if( target.id == _.options.dtContainerId || target == _.options.container)
				_.options.clickOnDiv = true;
			target = target.parentNode;
		}
		if(!_.options.clickOnDiv && _.options.isShow){
			_.remove();
		}

	});

};

jsDatePicker.prototype.prepareInputValue = function(value) {

	var _ 		= this,
		splitedAll = value.split(' - '),
		splitedDate = splitedAll[0].split('/'),
		change 	= false,
		edit 	= false;

		
  	if (splitedDate.length > 0) {

    	// On change le jour
    	if (splitedDate[0] && !isNaN(splitedDate[0])) {
    		_.options.selectedDay = (splitedDate[0] != '00' ? splitedDate[0] : new Date().getDate());
    		change = true;
    	}

    	// on change le mois
    	if (splitedDate[1] && splitedDate[1] > 0 && splitedDate[1] <= 12 && !isNaN(splitedDate[1])) {
    		if (splitedDate[1] == '00') {
    			splitedDate[1] = new Date().getMonth();
    			edit = true;
    		}
    		_.options.selectedMonth = splitedDate[1]-1;
    		_.options.currentMonth  = splitedDate[1]-1;
    		change = true;
    	}

    	// on change l'année
    	if (splitedDate[2] && !isNaN(splitedDate[2])) {
    		if (splitedDate[2] == '0000'){
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
		
    }
    
    if (edit) {
    	_.options.container.value = _.selectedDayToString();
    }
    return change;
};

jsDatePicker.prototype.isDisabledItem = function(dayIndex, dayDate) {

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

jsDatePicker.prototype.isDisabledDay = function(day) {

	var _ = this;

	if (_.options.disabledItems.days.length > 0) {
		if (day == 0 && _.options.disabledItems.days.indexOf('sunday') >= 0)
			return true;
		else if (day == 1 && _.options.disabledItems.days.indexOf('monday') >= 0)
			return true;
		else if (day == 2 && _.options.disabledItems.days.indexOf('tuesday') >= 0)
			return true;
		else if (day == 3 && _.options.disabledItems.days.indexOf('wednesday') >= 0)
			return true;
		else if (day == 4 && _.options.disabledItems.days.indexOf('thursday') >= 0)
			return true;
		else if (day == 5 && _.options.disabledItems.days.indexOf('friday') >= 0)
			return true;
		else if (day == 6 && _.options.disabledItems.days.indexOf('saturday') >= 0)
			return true;

	}

	return false;

};
jsDatePicker.prototype.isDisabledDate = function(date) {

	var _ = this;

	if (_.options.disabledItems.dates.indexOf(date) >= 0)
			return true;

	return false;

};

jsDatePicker.prototype.remove = function() {

	var _ = this;

	_.options.isShow = false;
	_.options.dtContainer.remove();
	_.options.dtContainer = null;
};
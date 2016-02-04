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
		yearMin 			: 100,  // Current -100
		yearMax 			: 5,  	// Current +5
		isInput 			: false,
		isShow 				: false,// Seulement utilisé pour les input
		closeOnSelect 		: false,
		clickOnDiv 			: false,
		disabledItems 		: {},
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

jsDatePicker.prototype.getSelectedHourContainer = function() {
	return this.options.selectedHourContainer;
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
	this.options.dtSelectMonth.value = parseInt(this.getCurrentMonth());
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
	
	var tr = document.createElement('tr');
	tr.className = 'dt-header';
	
	var html = '';
	for(var i = 0; i <= 6; i++ ){
		html += '<td class="dt-header-day">';
		html += this.getDayLabel(i);
		html += '</td>';
	}
	tr.innerHTML = html;
		
	if (this.useTime() === true) {
		
		this.options.dtHourContainer = document.createElement('td');
		this.options.dtHourContainer.setAttribute('rowspan', 6);
		this.options.dtHourContainer.className = 'dt-hour-container';
	 	html = '<ul>';
	 	var hourValue = '';
	 	for (var i = this.options.minHour; i <= this.options.maxHour; i++) {
	 		hourValue = (i > 9 ? '' : '0')+i+':00';
	 		html += '<li class="dt-hour '+(this.options.selectedHour != hourValue ? '' : 'dt-hour-selected')+'" data-value="'+hourValue+'">'+(i > 9 ? '' : '0')+i+':00'+'</li>';
	 		if (this.options.useTimeQuarter) {
	 			for (var j = 15; j <= 45; j += 15) {
	 				hourValue = (i > 9 ? '' : '0')+i+':'+j;
	 				html += '<li class="dt-hour '+(this.options.selectedHour != hourValue ? '' : 'dt-hour-selected')+'" data-value="'+hourValue+'">'+(i > 9 ? '' : '0')+i+':'+j+'</li>';	
	 			}
	 		}else if (this.options.useTimeHalf) {
	 			hourValue = (i > 9 ? '' : '0')+i+':30';
	 			html += '<li class="dt-hour '+(this.options.selectedHour != hourValue ? '' : 'dt-hour-selected')+'" data-value="'+hourValue+'">'+(i > 9 ? '' : '0')+i+':30'+'</li>';
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

jsDatePicker.prototype.initTimePosition = function() {
	
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

jsDatePicker.prototype.setTimeSelected = function() {
	
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

jsDatePicker.prototype.generateDayHTML = function() {

	var _ 			= this,
		firstDay 	= new Date(_.getCurrentYear(), _.getCurrentMonth(), 1),
		startingDay = firstDay.getDay(),
		monthLength = new Date(_.getCurrentYear(), _.getCurrentMonth()+1, 0).getDate(),
		monthName 	= _.getCurrentMonthLabel();
	
	_.changeSelectMonth();
	_.changeSelectYear();

	var today 		= _.getCurrentDate(),
		todayDay 	= today.getDate(),
		todayMonth 	= today.getMonth(),
		isToday 	= false,
		day = 1,
		isDayOfMonth = false,
		tr = null,
		td = null;
		
	
	var dtTrDay = _.options.dtTableBodyContainer.querySelectorAll('.dt-tr-day');
	if (dtTrDay) {
		for (var i = 0; i < dtTrDay.length; i++) {
			dtTrDay[i].remove();
		}
	}
	// Ligne
	for (var i = 0; i < 9; i++) {
		
		tr = document.createElement('tr');
		tr.className = 'dt-tr-day';
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
			
			td = document.createElement('td');
			
			td.className = enabled+' '+(isDayOfMonth ? 'dt-day' : '')+' '+(isToday ? 'dt-current' : '')+' '+(isSelected ? 'dt-selected' : '');
			td.setAttribute('data-day', day);
			if (isDayOfMonth) {
	        	td.innerHTML = '<span>'+day+'</span>';
	        	day++;
	      	}

	      	if (isSelected)
	      		_.options.selectedDayContainer = td;
	     
	      	tr.appendChild(td);
	    }
	    if (day > monthLength) {
	      	break;
	    }
	    
	    _.options.dtTableBodyContainer.appendChild(tr);
	}
	
	_.bindDay();

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

	_.generateDayHTML();
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

	_.generateDayHTML();

};

jsDatePicker.prototype.bindSelectMonth = function() {
	
	var _ = this;

	this.options.dtSelectMonth.addEventListener('change', function(e) {
		e.preventDefault();
		_.onChangeSelectMonth(this);
	}, false);
};

jsDatePicker.prototype.onChangeSelectMonth = function(selectMonth) {
	this.options.currentMonth = parseInt(selectMonth.value);
	this.generateDayHTML();
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
	this.generateDayHTML();
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
    	
    	var target = e.target;
    	
    	while( target){
    		if (target.nodeName == 'TBODY')
    			break;
			if( target.className.indexOf('dt-hour-container') >= 0)
				return;
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

	_.generateDayHTML();

};

jsDatePicker.prototype.bindDay = function() {

	var _ = this,
		days = _.options.dtTableBodyContainer.querySelectorAll('.dt-day.enabled');

	for (var i = 0; i < days.length; i++) {
		if (days[i].addEventListener) {
			days[i].addEventListener('click', function(e){
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

jsDatePicker.prototype.isNumeric = function(n) {
	return !isNaN(parseFloat(n)) && isFinite(n); 
};

jsDatePicker.prototype.clickOnHour = function(hour) {
	
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

jsDatePicker.prototype.bindTime = function() {
	
	var _ = this,
		hours = _.options.dtTableBodyContainer.querySelectorAll('.dt-hour');
		
	for (var i = 0; i < hours.length; i++) {
		hours[i].addEventListener('click', function(e) {
			e.preventDefault();
			_.clickOnHour(this);
		}, false);
	}
	
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
		toString += ' - '+_.options.selectedHour;
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
    		_.options.currentMonth  = parseInt(splitedDate[1])-1;
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
		
		_.options.selectedHour = _.options.currentHour+':'+_.options.currentMinutes;
		
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
/*
*
*	jsDatePicker
*
*	Author : Maxime Marais
*
*/

function jsDatePicker(options) {

	this.options = {
		defaultMonthLabels 	: ['January', 'February', 'March', 'April','May', 'June', 'July', 'August', 'September','October', 'November', 'December'],
		defaultDayLabels  	: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		currentDate 		: null,
		monthLabels 		: [],
		dayLabels 			: [],
		todayLabel 			: 'Today',
		container 			: null,
		dtContainer 		: null,
		dtContainerId 		: null,
		currentMonth 		: null,
		currentYear			: null,
		selectedDayContainer: null,
		getSelectedDay 		: null, 
		selectedMonth 		: null,
		selectedYear 		: null,
		isInput 			: false,
		isShow 				: false, // Seulement utilisé pour les input
		closeOnSelect 		: false,
		clickOnDiv 			: false,
		disabledItems 		: {}

	};

	this.init(options);

	if (!this.options.isInput)
		this.generateHTML();

	return this;
}

jsDatePicker.prototype.init = function(options) {

	var _ = this;


	for (key in options) { 
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

	if (_.options.monthLabels.length == 0) {
		_.options.monthLabels = _.options.defaultMonthLabels;
	}

	if (_.options.dayLabels.length == 0) {
		_.options.dayLabels = _.options.defaultDayLabels;
	}

	if (_.options.container.nodeName == 'INPUT') {
		_.options.isInput = true;

		_.prepareInputValue(_.options.container.value);
	
		_.bindInput();
	}


	return this;
}

jsDatePicker.prototype.getCurrentDate = function() {

	var _ = this;

	if (_.options.currentDate) {
		_.options.currentDate = new Date();
	}

	return _.options.currentDate
}

jsDatePicker.prototype.getCurrentYear = function() {
	return this.options.currentYear;
}

jsDatePicker.prototype.getCurrentMonth = function() {
	return this.options.currentMonth;
}

jsDatePicker.prototype.getCurrentMonthLabel = function() {
	return this.options.monthLabels[this.getCurrentMonth()];
}

jsDatePicker.prototype.getDayLabel = function(day) {
	return this.options.dayLabels[day] ? this.options.dayLabels[day] : '';

}

jsDatePicker.prototype.getSelectedDayContainer = function() {
	return this.options.selectedDayContainer;
}

jsDatePicker.prototype.getSelectedDay = function() {
	return this.options.selectedDay;
}

jsDatePicker.prototype.getSelectedMonth = function() {
	return this.options.selectedMonth;
}

jsDatePicker.prototype.getSelectedYear = function() {
	return this.options.selectedYear;
}

jsDatePicker.prototype.generateHTML = function() {

	var _ 			= this,
		firstDay 	= new Date(_.getCurrentYear(), _.getCurrentMonth(), 1),
		startingDay = firstDay.getDay();
		monthLength = new Date(_.getCurrentYear(), _.getCurrentMonth()+1, 0).getDate(),
		monthName 	= _.getCurrentMonthLabel();


	var html = '<table class="dt-table">';

	html += '<tr><th><div class="dt-nav dt-previous-month"><</div></th><th colspan="5">';
	html += monthName+"&nbsp;"+_.getCurrentYear();
	html += '</th><th><div class="dt-nav dt-next-month">></div></th></tr>';
	html += '<tr class="dt-header">';

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

			isSelected = false;
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
	html += '</tr><tr><td colspan="7"><div class="dt-today">'+_.options.todayLabel+'</div></td></tr></table>';
	
	if (!_.options.dtContainer) {
		_.options.dtContainer = document.createElement('div');
		_.options.dtContainerId =  'dt-'+Math.random().toString(36).substr(2, 9);
		_.options.dtContainer.setAttribute('id', _.options.dtContainerId);
		_.options.dtContainer.className += ' dt-container';
	}
	_.options.dtContainer.innerHTML = html;

	if (!_.options.isInput) {
		_.options.container.innerHTML = '';
		_.options.container.appendChild(_.options.dtContainer);
	} else {


		_.options.dtContainer.style.position = 'absolute';
		// _.options.dtContainer.style.left = _.options.container.offsetLeft+'px';
		// _.options.dtContainer.style.top = (_.options.container.offsetTop+_.options.container.clientHeight+5)+'px';
		//_.options.container.parentNode.insertBefore(_.options.dtContainer, _.options.container.nextSibling);

		var pos = _.getPosition(_.options.container);

		_.options.dtContainer.style.zIndex = '999';
		 _.options.dtContainer.style.left = pos[0]+'px';
		_.options.dtContainer.style.top = (pos[1]+_.options.container.clientHeight+5)+'px';
		document.body.appendChild(_.options.dtContainer);
	}

	_.bindDay();
	_.bindNextMonth();
	_.bindPreviousMonth();
	_.bindToday();
}

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
}

jsDatePicker.prototype.bindNextMonth = function() {

	var _ = this,
		nextMonth = _.options.dtContainer.querySelector('.dt-next-month');

	nextMonth.addEventListener('click', function(e) {

		e.preventDefault();
		_.clickOnNextMonth(this);

	}, false);
}

jsDatePicker.prototype.clickOnNextMonth = function(nextMonth) {
	
	var _ = this;

	if (_.getCurrentMonth() < 11) {
		_.options.currentMonth++;
	} else {
		_.options.currentMonth = 0;
		_.options.currentYear++;
	}

	_.generateHTML();

}


jsDatePicker.prototype.bindPreviousMonth = function() {

	var _ = this,
		previousMonth = _.options.dtContainer.querySelector('.dt-previous-month');

	previousMonth.addEventListener('click', function(e) {

		e.preventDefault();

		_.clickOnPreviousMonth(this);

	}, false);
}

jsDatePicker.prototype.clickOnPreviousMonth = function(previousMonth) {
	
	var _ = this;

	if (_.getCurrentMonth() > 0) {
		_.options.currentMonth--;
	} else {
		_.options.currentMonth = 11;
		_.options.currentYear--;
	}

	_.generateHTML();

}

jsDatePicker.prototype.bindToday = function() {

	var _ = this,
		today = _.options.dtContainer.querySelector('.dt-today');

	today.addEventListener('click', function(e) {

		e.preventDefault();

		_.clickOnToday(this);

	}, false);
}

jsDatePicker.prototype.clickOnToday = function(previousMonth) {
	
	var _ = this,
		date = new Date();

	_.options.currentMonth = date.getMonth();
	_.options.currentYear  = date.getFullYear();

	_.generateHTML();

}

jsDatePicker.prototype.bindDay = function() {

	var _ = this,
		days = _.options.dtContainer.querySelectorAll('.dt-day.enabled');

	Array.prototype.forEach.call(days, function(elem, index){

		elem.addEventListener('click', function(e){
			e.preventDefault();
			e.stopImmediatePropagation();
			_.clickOnDay(this);
		}, false)
		
	});
	
}

jsDatePicker.prototype.clickOnDay = function(day) {
	
	var _ = this;

	if (_.getSelectedDayContainer()) {
		daySelected = _.options.dtContainer.querySelectorAll('.dt-selected');
		for (var i=0; i<daySelected.length; i++)
			daySelected[i].className = daySelected[i].className.replace(' dt-selected', '');
	}

	_.options.selectedDayContainer = day;
	_.options.selectedDay 		= day.getAttribute('data-day');
	_.options.selectedMonth 	= _.options.currentMonth;
	_.options.selectedYear 		= _.options.currentYear;

	_.options.selectedDayContainer.className += ' dt-selected';
		
	_.selectedDayToString();

	if (_.options.closeOnSelect)
		_.remove();

}

jsDatePicker.prototype.selectedDayToString = function() {

	var _ 			= this,
		d 			= '',
		m 			= '',
		toString 	= '';

	if (_.getSelectedDayContainer()) {

		if (parseInt(d = _.getSelectedDayContainer().getAttribute('data-day')) < 10 )
			d = '0'+d;

		if ((m = _.options.selectedMonth+1) < 10)
			m = '0'+m;

		toString = d+'/'+m+'/'+_.options.selectedYear;
		
	}

	if (_.options.isInput) {
		_.options.container.value = toString;
	}

	return toString;
}

jsDatePicker.prototype.bindInput = function() {

	var _ = this;
	
	_.options.container.addEventListener('focus', function() {
		_.options.isShow = true;
		_.prepareInputValue(this.value);
		_.generateHTML();
	}, false);

	_.options.container.addEventListener('blur', function(e) {

		// console.log(e);
		// if(!_.options.clickOnDiv && _.options.isShow){
		// 	_.remove();
		// }
	});

	_.options.container.addEventListener('keyup', function(e) {
		
	
        var value 	= _.options.container.value;
        	
        if (_.prepareInputValue(value))
            _.generateHTML();
                
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

}

jsDatePicker.prototype.prepareInputValue = function(value) {

	var _ 		= this,
		splited = value.split('/'),
		change 	= false;

  	if (splited.length > 0) {

    	// On change le jour
    	if (splited[0] && !isNaN(splited[0])) {
    		_.options.selectedDay = splited[0];
    		change = true;
    	}

    	// on change le mois
    	if (splited[1] && splited[1] > 0 && splited[1] <= 12 && !isNaN(splited[1])) {
    		_.options.selectedMonth = splited[1]-1;
    		_.options.currentMonth  = splited[1]-1;
    		change = true;
    	}

    	// on change l'année
    	if (splited[2] && !isNaN(splited[2])) {
    		_.options.selectedYear 	= splited[2];
    		_.options.currentYear 	= splited[2];
    		change = true;
    	}
    }

    return change;
}

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
}

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

}
jsDatePicker.prototype.isDisabledDate = function(date) {

	var _ = this;

	if (_.options.disabledItems.dates.indexOf(date) >= 0)
			return true;

	return false;

}

jsDatePicker.prototype.remove = function() {

	var _ = this;

	_.options.isShow = false;
	_.options.dtContainer.remove();
	_.options.dtContainer = null;
}


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
		todayLabel 			: 'Today',
		container 			: null,
		dtContainer 		: null,
		dtContainerId 		: null,
		currentMonth 		: null,
		currentYear			: null,
		selectedDayContainer: null,
		selectedDay 		: null, 
		selectedMonth 		: null,
		selectedYear 		: null,
		isInput 			: false,
		isShow 				: false, // Seulement utilisé pour les input
		closeOnSelect 		: false,
		clickOnDiv 			: false,
		disabledItems 		: {},
		timepicker 			: false,
		currentHour 		: null,
		currentMinutes 		: null
	};

	this.init(options);

	if (!this.options.isInput)
		this.generateHTML();

	return this;
}

jsDatePicker.prototype.I18N = {
	'EN' : {
		monthLabels : ['January', 'February', 'March', 'April','May', 'June', 'July', 'August', 'September','October', 'November', 'December'],
		dayLabels  	: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	},
	'FR' : {
		monthLabels : ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
		dayLabels 	: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
	}
};

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
	
	html += '</tr>';
	
	if (_.useTime() === true) {
		html += '<tr><td colspan="7"><div class="dt-time-container"><span class="dt-time-text">Heure : </span><input type="number" value="'+_.options.currentHour+'" class="dt-time-hour" maxlength="2" max="23" min="0"/><span class="dt-time-separator">:</span><input type="number" value="'+_.options.currentMinutes+'" class="dt-time-minutes" maxlength="2" max="59" min="0"/></div></td></tr>';
	}
	html += '<tr><td colspan="7"><div class="dt-today">'+_.options.todayLabel+'</div></td></tr></table>';
	
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
	if (_.useTime() === true) {
		_.bindTime();
	}
	_.bindNextMonth();
	_.bindPreviousMonth();
	_.bindToday();
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
		toString += ' '+(_.options.currentHour < 10 ? '0' : '')+ parseInt(_.options.currentHour)+':'+(_.options.currentMinutes < 10 ? '0' : '')+parseInt(_.options.currentMinutes);
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

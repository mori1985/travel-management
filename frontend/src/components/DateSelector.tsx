import { useState, useEffect } from 'react';

interface DateSelectorProps {
  initialDate: string;
  onDateChange: (date: string) => void;
  dateType: 'departure' | 'return' | 'birth';
}

const DateSelector: React.FC<DateSelectorProps> = ({ initialDate, onDateChange, dateType }) => {
  const [selectedDate, setSelectedDate] = useState({ year: '', month: '', day: '' });
  const [isUserChange, setIsUserChange] = useState(false);

  useEffect(() => {
    if (initialDate) {
      const [y, m, d] = initialDate.split('-');
      setSelectedDate({
        year: y,
        month: m.padStart(2, '0'),
        day: d.padStart(2, '0'),
      });
      setIsUserChange(false);
    }
  }, [initialDate]);

  useEffect(() => {
    if (isUserChange && selectedDate.year && selectedDate.month && selectedDate.day) {
      const newDate = `${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`;
      onDateChange(newDate);
    }
  }, [selectedDate, isUserChange, onDateChange]);

  const getYears = () => {
    if (dateType === 'departure' || dateType === 'return') {
      return [1404];
    } else if (dateType === 'birth') {
      const years = [];
      for (let y = 1404; y >= 1300; y--) {
        years.push(y);
      }
      return years;
    }
    return [];
  };

  const getMonths = () => {
    if (dateType === 'departure' || dateType === 'return') {
      return [
        { value: '04', label: 'تیر' },
        { value: '05', label: 'مرداد' },
        { value: '06', label: 'شهریور' },
      ];
    } else if (dateType === 'birth') {
      return [
        { value: '01', label: 'فروردین' },
        { value: '02', label: 'اردیبهشت' },
        { value: '03', label: 'خرداد' },
        { value: '04', label: 'تیر' },
        { value: '05', label: 'مرداد' },
        { value: '06', label: 'شهریور' },
        { value: '07', label: 'مهر' },
        { value: '08', label: 'آبان' },
        { value: '09', label: 'آذر' },
        { value: '10', label: 'دی' },
        { value: '11', label: 'بهمن' },
        { value: '12', label: 'اسفند' },
      ];
    }
    return [];
  };

  const getDays = () => {
    if (dateType === 'departure' || dateType === 'return') {
      const days = [];
      for (let d = 1; d <= 31; d++) {
        days.push(String(d).padStart(2, '0'));
      }
      return days;
    } else if (dateType === 'birth') {
      const daysInMonth: Record<string, number> = {
        '01': 31, '02': 31, '03': 31, '04': 31, '05': 31, '06': 31,
        '07': 30, '08': 30, '09': 30, '10': 30, '11': 30, '12': 30,
      };
      const maxDays = selectedDate.month ? daysInMonth[selectedDate.month] || 31 : 31;
      const days = [];
      for (let d = 1; d <= maxDays; d++) {
        days.push(String(d).padStart(2, '0'));
      }
      return days;
    }
    return [];
  };

  const handleChange = (field: 'year' | 'month' | 'day', value: string) => {
    setSelectedDate((prev) => ({ ...prev, [field]: value }));
    setIsUserChange(true);
  };

  return (
    <div className="flex space-x-2">
      <select
        value={selectedDate.year}
        onChange={(e) => handleChange('year', e.target.value)}
        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
      >
        <option value="">سال</option>
        {getYears().map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <select
        value={selectedDate.month}
        onChange={(e) => handleChange('month', e.target.value)}
        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
      >
        <option value="">ماه</option>
        {getMonths().map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>
      <select
        value={selectedDate.day}
        onChange={(e) => handleChange('day', e.target.value)}
        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
      >
        <option value="">روز</option>
        {getDays().map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    </div>
  );
};

export default DateSelector;
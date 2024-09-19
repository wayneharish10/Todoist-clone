import dayjs from "dayjs";

export function getDays(date = dayjs().date()) {

    let dateptr = date;
    const year = dayjs().year();
    const dayList = new Array(4).fill(null).map(()=> {
        return dayjs(new Date(year, dayjs().month(), dateptr++));
    });
    return dayList;
}


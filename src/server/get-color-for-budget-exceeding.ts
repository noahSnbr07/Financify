interface _props {
    exceeding: number;
}

async function getColorForBudgetExceeding({ exceeding }: _props) {

    let color: string = "";

    switch (true) {
        case exceeding <= 20: color = "green"; break;
        case exceeding <= 40: color = "limegreen"; break;
        case exceeding <= 60: color = "yellow"; break;
        case exceeding <= 80: color = "orange"; break;
        case exceeding <= 100: color = "orangered"; break;
        case exceeding >= 100: color = "red"; break;
    }

    return color;
}

export default getColorForBudgetExceeding;
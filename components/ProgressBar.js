const formatDollarAmount = (amt) => {
    if (amt < 1000) {
        return amt;
    }
    else if (amt < 1e6) {
        return Math.round(amt / 1e3) + 'k';
    }
    else if (amt < 1e9) {
        return Math.round(amt / 1e6) + 'm';
    }
    else if (amt < 1e12) {
        return Math.round(amt / 1e9) + 'b';
    }
};

export default function ProgressBar({donations, goal}) {
    var progress = 0;

    donations.forEach((donation) => {
        progress += donation.amount;
    });

    return (
        <div className="w-40 sm:w-64">
            <div className="m-2 progress progress-container">
                <div 
                    style={{width: Math.round(progress/goal*100) + "%"}}
                    className="progress progress-inner"
                ></div>
            </div>
            <div className="flex flex-row">
                <div className="ml-2 mr-auto">
                    <p className="dark-text">Total Raised: <b>${formatDollarAmount(progress)}</b></p>
                </div>
                <div className="mr-2 ml-auto">
                    <p className="dark-text">Goal: <b>${formatDollarAmount(goal)}</b></p>
                </div>
            </div>
        </div>
    );
};

import dynamic from "next/dynamic";
import useDeviceDimensions from "../hooks/useDeviceDimensions";

const ReactApexChart = dynamic(() => import('react-apexcharts'), {ssr: false});

export default function LineWithAnnotationsChart({donations, goal}) {
    const { height: deviceHeight, width: deviceWidth } = useDeviceDimensions();

    var total = 0;
    var cummulativeDonations = [];

    donations.forEach(element => {
        total += element.amount;
        cummulativeDonations.push(total);
    });

    const series = [{
        name: "Total",
        data: cummulativeDonations,
    }];

    const options = {
        chart: {
            height: "100%",
            width: "100%",
            id: "GoalChart",
        },
        annotations: {
            yaxis: [{
                y: goal,
                fillColor: "#00E396",
                borderColor: "#00E396",
                borderWidth: 4,
                width: "100%",
                label: {
                    borderColor: "#00E396",
                    style: {
                        color: "#fff",
                        fontSize: "13px",
                        background: "#00E396",
                    },
                    text: "Goal",
                },
            }],
        },
        xaxis: {
            min: 1,
            max: cummulativeDonations.length,
            stepSize: 1,
            labels: {
                show: true,
                hideOverlappingLabels: true,
                style: {
                    colors: "#FFF",
                },
            },
            title: {
                text: "Donations",
                style: {
                    color: "#FFF",
                    fontSize: (deviceWidth < 900) ? "8px" : "12px",
                },
            },
        },
        yaxis: {
            min: 0,
            max: (goal > total) ? goal : total,
            labels: {
                show: true,
                hideOverlappingLabels: true,
                style: {
                    colors: "#FFF"
                },
            },
            title: {
                text: "Funds ($)",
                style: {
                    color: "#FFF",
                    fontSize: (deviceWidth < 900) ? "6px" : "10px",
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 4,
        },
        title: {
            text: (deviceWidth < 700) ? "" : "Fundraising Progress",
            style: {
                color: "#FFF",
                fontSize: (deviceWidth < 900) ? "10px" : "14px",
            },
        },
    };

    return (
        <ReactApexChart 
            series={series}
            options={options}
            type="line"
        />
    );
};

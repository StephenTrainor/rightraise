import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import('react-apexcharts'), {ssr: false});

export default function RadialBarChart({name, progress, goal}) {
    const series = [progress/goal * 100];

    const options = {
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                hollow: {
                    background: 'transparent',
                },
                track: {
                    show: true,
                    background: "#FFF",
                },
            },
        },
        labels: [`${progress} out of ${goal}`],
        title: {
            text: name,
            style: {
                color: "#FFF",
            },
            align: 'center',
        }
    };

    return (
        <ReactApexChart 
            series={series}
            options={options}
            type="radialBar"
        />
    );
};

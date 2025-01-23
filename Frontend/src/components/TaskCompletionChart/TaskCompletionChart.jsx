import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const TaskCompletionChart = ({ completedTasks, totalTasks }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const width = 45;
    const height = 45;
    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select(chartRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 1.8}, ${height / 2.46})`);

    const arc = d3
      .arc()
      .innerRadius(radius - 8)
      .outerRadius(radius - 4);

    const pie = d3
      .pie()
      .sort(null)
      .value((d) => d.value);

    const data = [
      { label: "", value: completedTasks },
      { label: "", value: totalTasks - completedTasks },
    ];

    const arcs = svg
      .selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => (i === 0 ? "#4caf50" : "#d3d3d3"));

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("dy", "0.35em")
      .style("text-anchor", "middle")
      .text((d) => d.data.label);

    // Add percentage text in the middle
    svg
      .append("text")
      .attr("class", "percentage-text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "0.6rem")
      .style("fill", "white")
      .text(`${Math.round((completedTasks / totalTasks) * 100)}%`);

    return () => {
      d3.select(chartRef.current).selectAll("*").remove();
    };
  }, [completedTasks, totalTasks]);

  return <svg ref={chartRef}></svg>;
};

export default TaskCompletionChart;

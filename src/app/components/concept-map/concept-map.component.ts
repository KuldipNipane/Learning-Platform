import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import { ClassesService } from 'src/app/services/classes.service';

@Component({
  selector: 'app-concept-map',
  templateUrl: './concept-map.component.html',
  styleUrls: ['./concept-map.component.css']
})
export class ConceptMapComponent implements OnInit {

  @Input() selectedMaterial: string = "";
  @Input() selectedSubject: string = "";

  private data: any = {};
  user: any = {};

  constructor(private classService: ClassesService)
   { }

  ngOnInit(): void {    
    document.addEventListener('click', this.handleDocumentClick.bind(this));

    const userString = localStorage.getItem('user');
    this.user = userString ? JSON.parse(userString) : {};
    this.fetchConceptMaps()
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleDocumentClick.bind(this));
  }

  handleDocumentClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    if (!clickedElement.closest('.node') && !clickedElement.closest('.description-group')) {
      this.removeDescriptionBox();
    }
  }

  removeDescriptionBox(): void {
    d3.select('#tree-container').selectAll('.description-group').remove();
  }

  fetchConceptMaps(){
    let schooleBoard = this.user.schoolBoard
    let className = this.user.schoolClass
    this.classService.getConceptMaps(schooleBoard, className,  this.selectedMaterial, this.selectedSubject).subscribe(
      (conceptMaps) => {
        this.data = conceptMaps[0]
        this.createTree(this.data);
      }
    )
  }

  createTree(data: any): void {
  const width = 1700;
  const height = 1500;

  const colors = ['#ff5733', '#bf00ff', '#3357ff', '#ff3300', '#ff6f61', '#ff4500'];

  const svg = d3
    .select('#tree-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(50,50)');

  const treeLayout = d3.tree().size([1000, 1000]);

  const root = d3.hierarchy(this.data, (d: any) => d.children) as d3.HierarchyNode<unknown>;
  const treeData = treeLayout(root);

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);


  // Create links (lines between nodes)
  svg
    .selectAll('.link')
    .data(treeData.links())
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr(
      'd',
      (d: d3.HierarchyPointLink<any>) => {
        const source = d.source;
        const target = d.target;
        return `M${source.y},${source.x}C${source.y + 50},${source.x} ${target.y - 50},${target.x} ${target.y},${target.x}`;
      }
    )
    .attr('fill', 'none')
    // .attr('stroke', () => colors[Math.floor(Math.random() * colors.length)]) // Assign random color
    .attr('stroke', (d) => colorScale(d.source.depth.toString())) // Use depth for color
    .attr('stroke-width',3)
    .attr('stroke-linecap', 'round') // Makes the stroke ends rounded
    .attr('stroke-linejoin', 'round'); // Smoothens joins (useful for sharp angles)    

const defs = svg.append("defs");
const filter = defs.append("filter")
    .attr("id", "drop-shadow")
    .attr("height", "130%");

filter.append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 3)
    .attr("result", "blur");

filter.append("feOffset")
    .attr("in", "blur")
    .attr("dx", 3)
    .attr("dy", 3)
    .attr("result", "offsetBlur");

filter.append("feComponentTransfer")
    .append("feFuncA")
    .attr("type", "linear")
    .attr("slope", 0.5);

const feMerge = filter.append("feMerge");
feMerge.append("feMergeNode")
    .attr("in", "offsetBlur");
feMerge.append("feMergeNode")
    .attr("in", "SourceGraphic");

  // Create nodes
  const nodes = svg
    .selectAll('.node')
    .data(treeData.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', (d) => `translate(${d.y},${d.x})`)

    nodes.on("click", function (event, d) {
      event.stopPropagation(); // Prevent the click from bubbling up to the document
      const maxLineLength = 50; // Maximum characters per line

      // Remove any existing description boxes
      svg.selectAll(".description-group").remove();

      // Create a group for the description box
      const descriptionGroup = svg.append("g").attr("class", "description-group");
      
      // Break description into multiple lines
      const descriptionText = (d.data as any).description || "";
      if (descriptionText.length == 0) {
        return
      }
      const words = descriptionText.split(" ");
      const lines: string[] = [];
      let currentLine = "";
      
      words.forEach((word: string) => {
          if ((currentLine + word).length > maxLineLength) {
              lines.push(currentLine.trim());
              currentLine = word + " ";
          } else {
              currentLine += word + " ";
          }
      });
      if (currentLine) lines.push(currentLine.trim());
      
      // Add the background rectangle
      const descriptionBg = descriptionGroup
          .append("rect")
          .attr("rx", 5) // Rounded corners
          .attr("ry", 5) // Rounded corners
          .attr("fill", "#1976d2") // Light background
          .attr("stroke", "#ffffff") // Border color
          .attr("stroke-width", 1)
          .attr("filter", "url(#drop-shadow)");

      
      // Add the description text
      const textElement = descriptionGroup
          .append("text")
          .attr("x", d.y + 15) // Add padding from the rectangle
          .attr("y", d.x) // Align with rectangle
          .attr("font-size", "14px")
          .attr("fill", "#ffffff");
      
      // Add each line as a tspan
      lines.forEach((line, i) => {
          textElement
              .append("tspan")
              .attr("x", d.y + 15) // Reset X for each line
              .attr("dy", i === 0 ? "1em" : "1.2em") // Line spacing
              .text(line);
      });
      
      // Dynamically adjust the rectangle size based on text size
      const bbox = textElement.node()!.getBBox();
      
      // Adjust X and Y for the rectangle to center the text
      descriptionBg
          .attr("width", bbox.width + 30) // Add padding
          .attr("height", bbox.height + 30) // Add padding
          .attr("x", bbox.x - 5) // Adjust X for padding
          .attr("y", bbox.y + 5); // Adjust Y for padding
      
      // Vertically align text with the background box
      const rectHeight = bbox.height + 30; // Height of the rectangle
      const rectY = bbox.y + 5; // Y position of the rectangle
      
      // Calculate the center of the rectangle
      const centerY = rectY + rectHeight / 2;
      
      // Adjust the Y position of the text to align it vertically centered
      textElement
          .attr("y", (centerY - rectHeight / 2)+10); // Set the Y position to center the text vertically

  });

  // Add circles to nodes
  nodes.append('circle').attr('r', 9).attr('fill', '#69b3a2');

  // Add node titles
  nodes
    .append('text')
    .attr('class', 'root')
    .attr('dx', 10)
    .attr('dy', -4) // Positioning above the node
    .text((d) => (d.data as any).root)
    .attr('font-size', '15px')
    .attr('font-weight', 'bold')
    .attr('fill', '#333')

  // Add descriptions (initially hidden)
  nodes
    .append('text')
    .attr('class', 'description')
    .attr('dx', 10)
    .attr('dy', 45) // Positioning below the title
    .text((d) => (d.data as any).description || '') // Only display if description exists
    .attr('font-size', '15px')
    .attr('fill', '#666')
    .style('display', 'none'); // Initially hide all descriptions


    nodes.filter(d => (d.data as any).description)
    .append('text')
    .attr('class', 'info-icon')
    .attr('x', -1)
    .attr('y', 4)
    .attr('font-size', '12px')
    .attr('fill', 'white')
    .text('i');

}
}

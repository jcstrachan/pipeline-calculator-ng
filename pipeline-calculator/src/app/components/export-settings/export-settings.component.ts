import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ChartComponent } from '../data-visualisation/chart/chart.component';
import { IPipeline } from 'src/app/interfaces/pipeline';
import jsPDF from 'jspdf';
import * as echarts from 'echarts';
import { MatDialog } from '@angular/material/dialog';
import { InvalidExportDialogComponent } from '../../dialogues/invalid-export-dialog/invalid-export-dialog.component';
import { ExportDialogComponent } from '../..//dialogues/export-dialog/export-dialog.component';

@Component({
  selector: 'app-export-settings',
  templateUrl: './export-settings.component.html',
  styleUrls: ['./export-settings.component.css']
})
export class ExportSettingsComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  elevationURLs: string[] = [];
  bendingURLs: string[] = [];
  shearURLs: string[] = [];

  downloadOptions: boolean[] = [false, false, false];

  yLimits: number[][] = [
    [-5, 5],
    [-2, 2],
    [-5, 5],
    [-1, 2.5]
  ]

  yAxisNames: string[] = [
    'Axial tension force (N)*10^4'
  ]

  @Output() exportEmitter = new EventEmitter;

  ngOnInit(): void {
  }

  @ViewChild(ChartComponent, {static: false}) chartComponent!: ChartComponent;

  public exportData() {
    this.exportEmitter.emit(true);
  }

  public updateDownloadOptions(optionNumber: number) {
    this.downloadOptions[optionNumber] = !this.downloadOptions[optionNumber];
  }

  // Calls export functions depending on which export options were selected
  // Opens the invalid export settings dialog if no settings were chosen
  public async beginExport(pipelines: IPipeline[], deltaS: number) {
    if (this.downloadOptions[0] === false && this.downloadOptions[1] === false) {
      this.dialog.open(InvalidExportDialogComponent);
    } else {
      this.dialog.open(ExportDialogComponent);
      if (this.downloadOptions[0]) {
        // download JSON variables
        this.exportJSON(pipelines);
      }
      if (this.downloadOptions[1]) {
        // download PDF of charts
        this.exportPDF(pipelines, deltaS);
      }
    }
  }

  // Stringifys the pipeline data, assigns it to a URL, then downloads the data as a JSON file.
  public exportJSON(pipelines: IPipeline[]) {
    const jsonFile = JSON.stringify(pipelines);
    const blob = new Blob([jsonFile], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'pipelines_data.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Creates and exports a PDF using the jsPDF module
  public async exportPDF(pipelines: IPipeline[], deltaS: number) {
    // Setting up the variables
    this.elevationURLs, this.bendingURLs, this.shearURLs = []
    const doc = new jsPDF();
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    let docY: number = 10

    for (let length of [40, 50, 60, 70, 80]) {
      const pipe = pipelines.find(item => item.buoyancySectionLength === length);

      if (pipe) {
        // get the elevation chart
        const chart = echarts.init(canvas);
        chart.setOption(this.getChartOption(pipe.coordinates, 'Elevation (m)', [-5, 5], pipe.buoyancySectionLength));
        const elevImage = chart.getDataURL();
        this.elevationURLs.push(elevImage);

        // get the bending moments chart
        chart.setOption(this.getChartOption(this.genCoords(pipe.bendingMoments, deltaS, 100000000000), 'Bending moment (N*m)*10^7', [-2, 2], pipe.buoyancySectionLength))
        const bendImage = chart.getDataURL();
        this.bendingURLs.push(bendImage);

        // get the shear forces chart
        chart.setOption(this.getChartOption(this.genCoords(pipe.shearForces, deltaS, 10000000000), 'Shear force (N)*10^5', [-5, 5], pipe.buoyancySectionLength));
        const shearImage = chart.getDataURL();
        this.shearURLs.push(shearImage);
      }
      

    }

    doc.setFontSize(12);

    // Only runs if the explanations option was checked
    if (this.downloadOptions[2]==true) {
      doc.setFontSize(16);
      doc.text('Pipeline Buoyancy Module Calculator', 10, docY);
      docY += 15;

      doc.setFontSize(12);
      var lines = doc.splitTextToSize('The first step is to calculate the theta function, for the purposes of this proof of concept, these values were estimated (to see a detailed explanation on this, view appendix 1 of this document). Once the theta function has been defined, the coordinates and forces acting on the pipeline can be calculated.', 180);
      doc.text(lines, 10, docY);
      docY += 25;
    }

    lines = doc.splitTextToSize('Elevation graphs of each buoyancy section: ', 180);
    doc.text(lines, 10, docY);
    docY += 5;

    doc.addImage(this.elevationURLs[0], 'PNG', 5, docY, 60, 60);
    doc.addImage(this.elevationURLs[1], 'PNG', 75, docY, 60, 60);
    doc.addImage(this.elevationURLs[2], 'PNG', 145, docY, 60, 60);
    docY += 70;
    doc.addImage(this.elevationURLs[3], 'PNG', 40, docY, 60, 60);
    doc.addImage(this.elevationURLs[4], 'PNG', 120, docY, 60, 60);
    docY += 70;

    // Only runs if the explanations option was checked
    if (this.downloadOptions[2]==true) {
      lines = doc.splitTextToSize('Next, the bending moments acting along the pipeline are calculated. To do this, we use the results from the previous calculations in the following equation: ', 180);
      doc.text(lines, 10, docY);
      docY += 10;

      var img = new Image();
      img.src = '../../../assets/bendingMoments.png'
      doc.addImage(img, 'png', 80, docY, 50, 20);
      docY += 30;

      lines = doc.splitTextToSize('As you can see in the equation above, to calculate the bending moment at the current position, you multiple E and I (where E = Pipeline\'s elasticity modulus and I is the moment of intertia of the pipeline\'s cross section). You then multiply that by the following fraction. The fraction takes the current theta value minus the previous theta value as a numerator and the length of the finite difference interval as a denominator. After looping all theta values through this equation we can then plot the data onto graphs.', 180);
      doc.text(lines, 10, docY);
      doc.addPage();
      docY = 20;
      
    }

    lines = doc.splitTextToSize('Bending moment graphs of each buoyancy section: ', 180);
    doc.text(lines, 10, docY);
    docY += 5;

    doc.addImage(this.bendingURLs[0], 'PNG', 5, docY, 60, 60);
    doc.addImage(this.bendingURLs[1], 'PNG', 75, docY, 60, 60);
    doc.addImage(this.bendingURLs[2], 'PNG', 145, docY, 60, 60);
    docY += 70;
    doc.addImage(this.bendingURLs[3], 'PNG', 40, docY, 60, 60);
    doc.addImage(this.bendingURLs[4], 'PNG', 120, docY, 60, 60);

    // Only runs if the explanations option was NOT checked
    if (!this.downloadOptions[2]){
      doc.addPage();
      docY = 20;
    } else {
      docY += 70;
    }

    // Only runs if the explanations option was checked
    if (this.downloadOptions[2]==true) {
      lines = doc.splitTextToSize('Now that the bending moments across the pipeline have been calculated, we can now use the results to calculate the shear force across the pipeline by using the following equation: ', 180);
      doc.text(lines, 10, docY);
      docY += 10;

      var img = new Image();
      img.src = '../../../assets/shearForces.png'
      doc.addImage(img, 'png', 80, docY, 50, 20);
      docY += 30;

      lines = doc.splitTextToSize('This time the equation is a lot more simple. To calculate the shear force at the current position, you take the negative of a fraction where the numerator is the current bending moment minus the previous bending moment and the denominator is the length of the finite difference interval. After calculating each shear foce, we can then once again plot the data.', 180);
      doc.text(lines, 10, docY);
      doc.addPage();
      docY = 20;
      
    }

    lines = doc.splitTextToSize('Shear force graphs of each buoyancy section: ', 180);
    doc.text(lines, 10, docY);
    docY += 5;

    doc.addImage(this.shearURLs[0], 'PNG', 5, docY, 60, 60);
    doc.addImage(this.shearURLs[1], 'PNG', 75, docY, 60, 60);
    doc.addImage(this.shearURLs[2], 'PNG', 145, docY, 60, 60);
    docY += 70;
    doc.addImage(this.shearURLs[3], 'PNG', 40, docY, 60, 60);
    doc.addImage(this.shearURLs[4], 'PNG', 120, docY, 60, 60);
    docY += 70;

    // Only runs if the explanations option was checked
    if (this.downloadOptions[2]==true) {
      docY = 10;
      doc.addPage();
      doc.setFontSize(16);
      doc.text('Appendix', 10, docY);
      docY += 15;

      doc.setFontSize(12);
      var lines = doc.splitTextToSize('As mentioned at the start of this document, the theta function for this proof of concept is just an estimate. This is done by using a pre-determined function that alters the shape of the curve based on the length of the buoyancy module section. The equation used for this calculation is as follows:', 180);
      doc.text(lines, 10, docY);
      docY += 20;

      var img = new Image();
      img.src = '../../../assets/thetaCalc.png'
      doc.addImage(img, 'png', 70, docY, 75, 15);
      docY += 30;

      doc.setFontSize(12);
      var lines = doc.splitTextToSize('The variable "a" is altered depending on the buoyancy section length whilst the variables "b", "c" and "d" are set to constant values to mimic the shape of pipeline configurations. The derivative is then taken at each point along this function and the local angle to the horizontal axis is taken to create a mock theta function of the pipeline.', 180);
      doc.text(lines, 10, docY);
      docY += 20;

    }

    // Downloads the PDF file
    doc.save('file.pdf');
  }

  // Returns coordinates by assigning an x value to each input y value
  public genCoords(yVals: number[], deltaS: number, divFactor: number): number[][] {
    let xyVals: number[][] = [];
    let x = 0;

    for (let yVal of yVals) {
      xyVals.push([x, yVal/divFactor]);
      x += deltaS;
    }

    return xyVals;
  }

  // Creates a new chart option, assigning the input parameters to their correct position and returns the object
  public getChartOption(data: number[][], yAxisName: string, yLimits: number[], length: number): echarts.EChartsOption {
    let chartOption: echarts.EChartsOption = {
      animation: false,
      grid: {
        top: 40,
        left: 50,
        right: 40,
        bottom: 50
      },
      xAxis: {
        name: 'Length of buoyancy section (m)',
        min: 0,
        max: 200,
        minorTick: {
          show: true
        },
        minorSplitLine: {
          show: true
        },
        nameLocation: 'middle',
        nameGap: 25,
        nameTextStyle: {
          color: '#333333'
        },
        axisLabel: {
          fontSize: 16
        },
      },
      yAxis: {
        name: yAxisName,
        min: yLimits[0],
        max: yLimits[1],
        minorTick: {
          show: true
        },
        minorSplitLine: {
          show: true
        },
        nameLocation: 'middle',
        nameGap: 25,
        nameTextStyle: {
          color: '#333333'
        },
        axisLabel: {
          fontSize: 16
        }
      },
      title: {
        text: 'Buoyancy Section Length: ' + String(length),
        textStyle: {
          fontWeight: 'normal'
        }
      },
      series: [
        {
          type: 'line',
          showSymbol: false,
          smooth: true,
          clip: true,
          data: data,
          label: {
            fontSize: 16
          }
          
        }
      ]
    };
    return chartOption;
  }
   
}

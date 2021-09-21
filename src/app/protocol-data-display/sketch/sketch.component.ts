import { Component } from '@angular/core';
import * as d3 from 'd3';
import { KeyboardService } from 'src/app/keyboard.service';
import { LabelFactoryService } from 'src/app/protocol-data-label-controls/label-factory.service';
import { CorrelatedClock } from 'src/app/protocol-data-playback-controls/time-control/clocks/correlated-clock';
import { TimeService } from 'src/app/protocol-data-playback-controls/time-control/time.service';
import { Point } from './point';
import { SketchControlService } from './sketch-controls/sketch-control.service';
import { SelectType } from './sketch-controls/sketch-controls.component';
import { SketchDataService } from './sketch-data.service';
import { SketchVizSettingsService } from './sketch-viz-settings.service';

interface Transform {
  x: number;
  y: number;
  k: number;
}

@Component({
  selector: 'app-sketch',
  templateUrl: './sketch.component.html',
  styleUrls: ['./sketch.component.css'],
})
export class SketchVizComponent {
  private svg: any;
  private drawing: any;
  private defaultColorScale: Function = () => {};
  private scaleX: Function = () => {};
  private scaleY: Function = () => {};
  private line: Function = () => {};
  private defaultRadius = 1.5;
  private radius = this.defaultRadius;
  private transform: Transform = { x: 0, y: 0, k: 1 };
  private selectType!: SelectType;

  private clock: CorrelatedClock;

  constructor(
    private sketchData: SketchDataService,
    private vizSettings: SketchVizSettingsService,
    private time: TimeService,
    private controller: SketchControlService,
    private labelFac: LabelFactoryService,
    private keyboard: KeyboardService
  ) {
    this.controller.rotate.subscribe((angle) => this.rotate(angle));
    this.sketchData.newdata.subscribe(() => this.initialise());
    this.clock = this.time.getSlaveClock('sketch');
  }

  async initialise() {
    this.svg = d3
      .select('svg')
      .attr('width', this.vizSettings.width)
      .attr('height', this.vizSettings.height);

    this.drawing = this.svg.append('g');

    await this.setScale();
    this.initZoom();

    this.clock.change.subscribe(() => this.handleClockChange());
    this.clock.tick.subscribe(() => this.render());

    this.sketchData.change.subscribe(() => this.render());
    this.sketchData.visibilityChanged.subscribe(() => this.render());
    this.controller.selectTypeChange.subscribe((type) =>
      this.setSelectType(type)
    );
  }

  private handleClockChange() {
    if (this.clock.effectiveSpeed === 0) {
      this.clock.stopTick();
    } else {
      this.clock.startTick();
    }
    this.render();
  }

  private async setScale() {
    const points = await this.sketchData.getPoints();

    const max = Math.max(
      d3.max(points, (d) => d.x) as number,
      d3.max(points, (d) => d.y) as number
    );

    this.scaleX = d3
      .scaleLinear()
      .domain([0, max])
      .range([25, this.vizSettings.width - 50]);

    this.scaleY = d3
      .scaleLinear()
      .domain([0, max])
      .range([25, this.vizSettings.height - 50]);

    this.line = d3
      .line()
      .x((d: any) => this.scaleX(d.x))
      .y((d: any) => this.scaleY(d.y))
      .curve(d3.curveCatmullRom.alpha(0.1));

    this.defaultColorScale = d3
      .scaleSequentialPow()
      .interpolator(d3.interpolateGreys)
      .domain([0, d3.max(points, (d: Point) => d.p) as number]);
  }

  private color(p: Point) {
    if (p.selected) {
      return 'magenta';
    } else if (p.solo) {
      return 'cyan';
    } else {
      return this.defaultColorScale(p.p);
    }
  }

  private initZoom() {
    this.keyboard.event.subscribe((key) => {
      if (this.keyboard.isPressed('z')) {
        this.deactivateBrush();
        this.svg.classed('zoom', true);
      } else {
        this.setSelectType();
        this.svg.classed('zoom', false);
      }
    });

    this.svg.call(
      d3
        .zoom()
        .scaleExtent([1, 8])
        .on('zoom', (e) => this.zoomed(e))
        .filter((e) => this.keyboard.isPressed('z'))
    );
  }

  private zoomed(e: any) {
    this.transform = e.transform;
    this.radius = this.defaultRadius / e.transform.k;
    this.drawing.attr('transform', e.transform);
    this.drawing.selectAll('circle').attr('r', this.radius);
    this.drawing.selectAll('path').attr('stroke-width', this.radius);
  }

  async render() {
    const strokes = this.sketchData.getStrokes();
    const points = this.sketchData.getPoints();
    const now = this.clock.seconds * 1000;

    const path = this.drawing
      .selectAll('path')
      .data(
        strokes.filter(
          (s) =>
            Math.min(...s.map((p) => p.t)) < now &&
            !s.reduce((mute, p) => mute || !!p.muted, false)
        )
      );

    path.enter().append('path');
    path.exit().remove();

    this.drawing
      .selectAll('path')
      .attr('fill', 'none')
      .attr('stroke', 'lightgray')
      .attr('stroke-width', this.radius)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .style('opacity', 0.5)
      .attr('d', (d: any) => this.line(d));

    const circle = this.drawing
      .selectAll('circle')
      .data(points.filter((d) => d.t < now && !d.muted));

    circle.enter().append('circle');
    circle.exit().remove();

    this.drawing
      .selectAll('circle')
      .attr('fill', (d: any) => this.color(d))
      .attr('cx', (d: any) => this.scaleX(d.x))
      .attr('cy', (d: any) => this.scaleY(d.y))
      .attr('r', this.radius)
      .on('mouseover', (e: any, d: any) => this.handleMouseOver(e, d))
      .on('mouseout', (e: any, d: any) => this.handleMouseOut(e, d))
      .on('click', (e: any, d: any) => this.handleClick(d));

    console.log('Rendered');
  }

  private handleClick(d: Point) {
    let points: Point[] = [];

    switch (this.selectType) {
      case SelectType.STROKE:
        points = this.getStrokePoints(d).data() as Point[];
        break;
      case SelectType.POINT:
        points = [d];
        break;
    }

    this.sketchData.setSelectState(points, !d.selected);
  }

  private getStrokePoints(d: Point) {
    return this.drawing
      .selectAll('circle')
      .filter((c: Point) => d.strokeId === c.strokeId);
  }

  private handleMouseOver(e: MouseEvent, d: Point) {
    d3.select(e.currentTarget as SVGCircleElement)
      .attr('fill', 'orange')
      .attr('r', this.radius * 3);

    this.svg
      .append('text')
      .attr('id', this.selector(d))
      .attr('x', () => 20)
      .attr('y', () => 10)
      .attr('font-size', 10)
      .html(() => this.textContent(d));
  }

  private handleMouseOut(e: MouseEvent, d: Point) {
    d3.select(e.currentTarget as SVGCircleElement)
      .attr('fill', this.color(d))
      .attr('r', this.radius);
    d3.select('#' + this.selector(d)).remove();
  }

  private selector(p: Point) {
    return (
      't' + Math.round(p.x) + '-' + Math.round(p.y) + '-' + Math.round(p.p)
    );
  }

  private textContent(p: Point) {
    let out = '';
    out += this.tspan('x', p.x);
    out += this.tspan('y', p.y);
    out += this.tspan('p', p.p);
    out += this.tspan('t', p.t);

    if (p.labels.length > 0) {
      out += this.tspan(
        'labels',
        p.labels
          .map((l) => {
            const i = this.labelFac.getLabelInstanceById(l);
            return (i && i.name) || false;
          })
          .filter((d) => d)
          .join(',')
      );
    }

    return out;
  }

  tspan(name: string, val: string | number) {
    return `<tspan x="10" dy="1.1em">- ${name}: ${val}</tspan>`;
  }

  private rotate(angle: number): void {
    console.log('rotate', angle);
    d3.select('svg').style('transform', `rotate(${angle}deg)`);
  }

  private setSelectType(type?: SelectType) {
    this.selectType = typeof type === 'undefined' ? this.selectType : type;
    console.log('selectType', type);

    this.deactivateBrush();
    if (
      this.selectType === SelectType.BRUSH ||
      this.selectType === SelectType.UNBRUSH
    ) {
      this.activateBrush(this.selectType === SelectType.BRUSH);
    } else if (this.selectType === SelectType.SELECT_ALL) {
      const now = this.clock.seconds * 1000;
      this.sketchData.selectAll((p: Point) => p.t < now && !p.muted);
    } else if (this.selectType === SelectType.UNSELECT_ALL) {
      this.sketchData.unselectAll();
    }
  }

  private activateBrush(mode: boolean) {
    const brush = d3
      .brush()
      .on('end', ({ selection }) => brushed(selection, mode));

    this.svg.append('g').attr('class', 'brush').call(brush);

    const brushed = (selection: any, selectMode: boolean) => {
      if (selection) {
        const [[x0, y0], [x1, y1]] = selection;
        const selected = this.drawing
          .selectAll('circle')
          .filter((d: Point) => {
            const x = this.x(d.x);
            const y = this.y(d.y);
            return x0 <= x && x < x1 && y0 <= y && y < y1;
          })
          .data();

        this.sketchData.setSelectState(selected, selectMode);
        this.svg.selectAll('.brush').call(brush.move, null);
      }
    };
  }

  private deactivateBrush() {
    this.svg.select('g.brush').remove();
  }

  private x(x: number) {
    return this.scaleX(x) * this.transform.k + this.transform.x;
  }

  private y(y: number) {
    return this.scaleY(y) * this.transform.k + this.transform.y;
  }
}

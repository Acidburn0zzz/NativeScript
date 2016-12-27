﻿import { AbsoluteLayoutBase, View, layout, Length } from "./absolute-layout-common";

export * from "./absolute-layout-common";

export class AbsoluteLayout extends AbsoluteLayoutBase {

    onLeftChanged(view: View, oldValue: Length, newValue: Length) {
        this.requestLayout();
    }

    onTopChanged(view: View, oldValue: Length, newValue: Length) {
        this.requestLayout();
    }

    public onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);

        let measureWidth = 0;
        let measureHeight = 0;

        const width = layout.getMeasureSpecSize(widthMeasureSpec);
        const widthMode = layout.getMeasureSpecMode(widthMeasureSpec);

        const height = layout.getMeasureSpecSize(heightMeasureSpec);
        const heightMode = layout.getMeasureSpecMode(heightMeasureSpec);

        const childMeasureSpec = layout.makeMeasureSpec(0, layout.UNSPECIFIED);

        this.eachLayoutChild((child, last) => {
            let childSize = View.measureChild(this, child, childMeasureSpec, childMeasureSpec);
            measureWidth = Math.max(measureWidth, child.effectiveLeft + childSize.measuredWidth);
            measureHeight = Math.max(measureHeight, child.effectiveTop + childSize.measuredHeight);
        });

        measureWidth += this.effectiveBorderLeftWidth + this.effectivePaddingLeft + this.effectivePaddingRight + this.effectiveBorderRightWidth;
        measureHeight += this.effectiveBorderTopWidth + this.effectivePaddingTop + this.effectivePaddingBottom + this.effectiveBorderBottomWidth;

        measureWidth = Math.max(measureWidth, this.effectiveMinWidth);
        measureHeight = Math.max(measureHeight, this.effectiveMinHeight);

        const widthAndState = View.resolveSizeAndState(measureWidth, width, widthMode, 0);
        const heightAndState = View.resolveSizeAndState(measureHeight, height, heightMode, 0);

        this.setMeasuredDimension(widthAndState, heightAndState);
    }

    public onLayout(left: number, top: number, right: number, bottom: number): void {
        super.onLayout(left, top, right, bottom);

        this.eachLayoutChild((child, last) => {

            const childWidth = child.getMeasuredWidth();
            const childHeight = child.getMeasuredHeight();

            const childLeft = this.effectiveBorderLeftWidth + this.effectivePaddingLeft + child.effectiveLeft;
            const childTop = this.effectiveBorderTopWidth + this.effectivePaddingTop + child.effectiveTop;
            const childRight = childLeft + childWidth + this.effectiveMarginLeft + this.effectiveMarginRight;
            const childBottom = childTop + childHeight + this.effectiveMarginTop + this.effectiveMarginBottom;

            View.layoutChild(this, child, childLeft, childTop, childRight, childBottom);
        });
    }
}
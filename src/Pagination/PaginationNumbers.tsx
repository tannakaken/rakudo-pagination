import React, { FC } from "react";
import { paginationStyle } from "./PaginationStyle";

type Props = {
  setUpdate?: (update: boolean) => void;
  setPage: (newPage: number) => void;
  page: number;
  rowsPerPage: number;
  totalCount: number;
  handleChangePage: (newPage: number) => void;
};

const Separator = () => <span style={paginationStyle.current}>|</span>;
const Ellipses = () => <span style={paginationStyle.current}>...</span>;

const decimatePageArray = (totalPagesNum: number, currentPageNum: number) => {
  if (totalPagesNum < 5) {
    return Array.from({ length: totalPagesNum }, (v, k) => k);
  }
  if (currentPageNum === 0) {
    return [0, 1, totalPagesNum - 1];
  }
  if (currentPageNum === 1) {
    return [0, 1, 2, totalPagesNum - 1];
  }
  if (currentPageNum === totalPagesNum - 2) {
    return [0, totalPagesNum - 3, totalPagesNum - 2, totalPagesNum - 1];
  }
  if (currentPageNum === totalPagesNum - 1) {
    return [0, totalPagesNum - 2, totalPagesNum - 1];
  }
  return [
    0,
    currentPageNum - 1,
    currentPageNum,
    currentPageNum + 1,
    totalPagesNum - 1,
  ];
};
const decimateForward = (pageArray: number[]) => {
  if (pageArray.length < 2) {
    return false;
  }
  return pageArray[1] !== 1;
};

const decimateBackward = (pageArray: number[], totalPagesNum: number) => {
  if (pageArray.length < 2) {
    return false;
  }
  return pageArray[pageArray.length - 2] !== totalPagesNum - 2;
};

const PaginationNumbers: FC<Props> = (props) => {
  const totalPagesNum = Math.ceil(props.totalCount / props.rowsPerPage);
  const pageArray = decimatePageArray(totalPagesNum, props.page);
  return (
    <span className="d-flex justify-content-center align-items-baseline">
      {pageArray.map((pageNumber) => (
        <span key={`paginator-link-${pageNumber}`} className="d-flex flex-row">
          {pageNumber === totalPagesNum - 1 &&
            decimateBackward(pageArray, totalPagesNum) && (
              <>
                <Ellipses />
                <Separator />
              </>
            )}
          <span
            onClick={() => {
              if (pageNumber !== props.page) {
                props.handleChangePage(pageNumber);
              }
            }}
            style={
              pageNumber === props.page
                ? paginationStyle.current
                : paginationStyle.normal
            }
          >
            {pageNumber + 1}
          </span>
          {pageNumber !== totalPagesNum - 1 && (
            <Separator key={`separator-${pageNumber}`} />
          )}
          {pageNumber === 0 && decimateForward(pageArray) && (
            <>
              <Ellipses />
              <Separator />
            </>
          )}
        </span>
      ))}
    </span>
  );
};

export default PaginationNumbers;

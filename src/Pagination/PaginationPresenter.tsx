import React, { useCallback, useState } from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";
import PaginationNumbers from "./PaginationNumbers";
import { paginationStyle } from "./PaginationStyle";

type PaginationPresenterProps = {
  /**
   * ページあたりの行数を変化させる。必ず同時にページを0にすること。
   *
   * オプショナル。undefinedにすると行数が変更できない（UIも消える）。
   */
  setRowsPerPageAndResetPageZero?: (newRowsPerPage: number) => void;
  /**
   * 現在のページの行数を変化させる。
   */
  setPage: (newPage: number) => void;
  /**
   * アップデートフラグの設定。データ取得を{@link useQueryPagination}から行っている場合は不要
   *
   * オプショナル。
   */
  setUpdate?: (update: boolean) => void;
  /**
   * 現在のページ
   */
  page: number;
  /**
   * ページあたりの行数
   */
  rowsPerPage: number;
  /**
   * 総行数
   */
  totalCount: number;
  /**
   * 現在の選択行数
   */
  selectedCount: number;
  /**
   * 行数の選択肢
   */
     rowsPerPageSelection: number[]
  /**
   * 行選択時にページを変更するときに出す警告メッセージ
   *
   * オプショナル。デフォルトはThe selection will be reset, is that okay?
   */
  warnMessageChangePage?: string;
  /**
   * 選択時にページを変更するときに出すOKボタンのメッセージ
   *
   * オプショナル。デフォルトはOK。
   */
  okMessage: string;
  /**
   * 選択時にページを変更するときに出すキャンセルボタンのメッセージ
   *
   * オプショナル。デフォルトはCancel。
   */
  cancelMessage: string;
};

/**
 * ページネーション
 */
export const PaginationPresenter = ({
  warnMessageChangePage =  "The selection will be reset, is that okay?",
  ...props
}: PaginationPresenterProps) => {
  const totalPage = Math.ceil(props.totalCount / props.rowsPerPage);
  const [okFunction, setOkFunction] = useState<(() => void) | undefined>(
    undefined
  );
  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (props.setRowsPerPageAndResetPageZero === undefined) {
        return;
      }
      if (props.selectedCount > 0) {
        // なぜこう書かなくちゃいけないか？
        // see https://ja.reactjs.org/docs/hooks-reference.html#usestate
        setOkFunction(() => () => {
          if (props.setRowsPerPageAndResetPageZero === undefined) {
            return;
          }
          props.setRowsPerPageAndResetPageZero(parseInt(value, 10));
          // NOTICE: props.SetPage(0)はする必要なし
          props.setUpdate?.(true);
        });
      } else {
        props.setRowsPerPageAndResetPageZero(parseInt(value, 10));
        // NOTICE: props.SetPage(0)はする必要なし
        props.setUpdate?.(true);
      }
    },
    [props]
  );
  const handleChangePage = useCallback(
    (newPage: number) => {
      if (newPage >= 0 && newPage < totalPage) {
        if (props.selectedCount > 0) {
          setOkFunction(() => () => {
            props.setPage(newPage);
            props.setUpdate?.(true);
          });
        } else {
          props.setPage(newPage);
          props.setUpdate?.(true);
        }
      }
    },
    [props, totalPage]
  );

  return (
    <div className="pagination">
      <Form.Row className="align-items-center justify-content-end">
        {props.setRowsPerPageAndResetPageZero !== undefined && (
          <Col xs="auto">
            {/*１ページあたりの表示件数*/}
            <Form.Control
              as="select"
              className={"mr-3"}
              id="rows-per-page"
              onChange={handleChangeRowsPerPage}
              value={props.rowsPerPage}
            >
              {props.rowsPerPageSelection.map((num, index) => (
                <option value={num.toString()} key={index}>
                  {num}
                </option>
              ))}
            </Form.Control>
          </Col>
        )}
        <Col xs="auto">
          {/*現在何番目から何番目のデータが表示されているかを表示する　(1 - 5 of 12)*/}
          <span className="ml-3">
            {props.page * props.rowsPerPage + 1} -{" "}
            {(props.page + 1) * props.rowsPerPage} of {props.totalCount}
          </span>
        </Col>
        <Col xs="auto">
          <div className="d-flex">
            <i
              style={props.page === 0 ? {} : paginationStyle.normalArrow}
              className="bi bi-chevron-left"
              onClick={() => handleChangePage(props.page - 1)}
            />
            <PaginationNumbers {...props} handleChangePage={handleChangePage} />
            <i
              style={
                props.page === totalPage - 1 ? {} : paginationStyle.normalArrow
              }
              className="bi bi-chevron-right"
              onClick={() => handleChangePage(props.page + 1)}
            />
          </div>
        </Col>
      </Form.Row>
      <Modal show={okFunction !== undefined}>
        <Modal.Header>{warnMessageChangePage}</Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOkFunction(undefined)}>
            {props.cancelMessage}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              okFunction?.();
              setOkFunction(undefined);
            }}
          >
            {props.okMessage}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

PaginationPresenter.defaultProps = {
  selectedCount: 0,
  okMessage: "OK",
  cancelMessage: "Cancel",
  rowsPerPageSelection: [10, 25, 100],
};


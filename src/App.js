import React, {Component} from 'react';
import ReactTable from 'react-table';
import queryString from 'query-string';
import Scrollbar from "react-perfect-scrollbar";
import { Pagination } from 'rsuite';
import classNames from "classnames";

import './App.css';
import 'react-table/react-table.css'
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'rsuite/styles/pagination.less'

const __params__ = {
    bondCode: "",
    bondName: "",
    issuetype: "",
    issueDate: "",
    bondTermID: "",
    issuebatchid: "",
    logFlag: false
};

const __pageSize__ = {
    page: 1,
    rows: 100
};

const FormatTermId = (data) => data + "年期";

const __columns__ = [
    {
        Header: "债券名称",
        accessor: "BONDNAME",
        minWidth: 100,
        style: {
            color: "red"
        }
    }, {
        Header: "债券代码",
        accessor: "BONDCODE",
        minWidth: 100,
    }, {
        Header: "债券类型",
        accessor: "TYPENAME",
        minWidth: 100,
    }, {
        Header: "发行方式",
        accessor: "ISSUETYPE",
        minWidth: 100,
    }, {
        Header: "发行日期",
        accessor: "ISSUEDATE",
        minWidth: 100,
    }, {
        Header: "发行批次",
        accessor: "BATCHMODE",
        minWidth: 100,
    }, {
        Header: "发行期限",
        id: "BONDTERMID",
        accessor: (d) => FormatTermId(d.BONDTERMID),
        minWidth: 100,
    }, {
        Header: "债券金额(万元)",
        accessor: "BONDLIMIT",
        minWidth: 100,
    }, {
        Header: "新增额度(万元)",
        accessor: "NEWS",
        minWidth: 100,
    }, {
        Header: "置换额度(万元)",
        accessor: "REPLACEMENT",
        minWidth: 100,
    }, {
        Header: "借新还旧(万元)",
        accessor: "REFUNDING",
        minWidth: 100,
    }];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: __columns__
        };
    }

    componentDidMount() {
        this.load(__params__);
    }

    load = (params = {}) => {
        this.setState({loading: true});

        Object.assign(__pageSize__, params);
        fetch("http://192.168.8.26:8080/BondManagerSys/bondInfoAction/bondInfoList.do", {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: queryString.stringify(__pageSize__)
        }).then(res =>
            res.json()
        ).then(data => {
            this.setState({
                data: data.rows,
                loading: false,
                pages: data.totalPageCount,
                page: (data.currentPageNo - 1),
                pageSize: data.pageSize
            },
                this._scrollBarRef.updateScroll());
        });
    };

    update = (params) => {
        this.load(Object.assign(__params__, params));
    };

    onPageChange = (currentPage) => {
        const pageInfo = {page: currentPage + 1};
        this.update(pageInfo)
    };
    onPageSizeChange = (currentPageSize, currentPage) => {
        const pageInfo = {page: currentPage + 1, rows: currentPageSize};
        this.update(pageInfo);
    };


    render() {
        return (
            <ReactTable {...this.state}
                        className="-striped -highlight"
                        style={{
                            height: document.body.clientHeight // This will force the table body to overflow and scroll, since there is not enough room
                        }}
                        onPageChange={this.onPageChange}
                        onPageSizeChange={this.onPageSizeChange}
                        manual
                        noDataText={"无数据"}
                        loadingText={"正在加载..."}
                        previousText={"上一页"}
                        nextText={"下一页"}
                        pageText={"第"}
                        ofText={""}
                        TbodyComponent={
                            props => (
                                <div {...props} className={classNames("rt-tbody", props.className || [])}>
                                <Scrollbar ref = { ref => this._scrollBarRef = ref } >{props.children}</Scrollbar>
                                </div>
                            )
                        }
                        PaginationComponent={
                            props => {
                                return <Pagination
                                    prev
                                    last
                                    next
                                    first
                                    size="xs"
                                    pages={10}
                                    activePage={this.state.activePage}
                                    onSelect={this.handleSelect}
                                />
                            }
                        }

            >
            </ReactTable>
        );
    }
}

export default App;

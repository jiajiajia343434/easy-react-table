import React, {Component} from 'react';
import ReactTable from 'react-table';
import {ReactTableDefaults} from 'react-table'
import queryString from 'query-string';
import Scrollbar from "react-perfect-scrollbar";
import Pagination from 'rc-pagination';
import Select from 'rc-select';
import classNames from "classnames";

import 'react-table/react-table.css'
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'rc-pagination/dist/rc-pagination.css'
import 'rc-select/assets/index.css'
import './App.css';

const Tr = ReactTableDefaults.TrComponent;
const Td = ReactTableDefaults.TdComponent;

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
    rows: 100,
    Pagination: ['10', '20', '50', '100']
};

const FormatTermId = (data) => data + "年期";

const __columns__ = [
    {
        Header: "债券名称",
        accessor: "BONDNAME",
        minWidth: 560,
        style: {
            textAlign: "center",
            whiteSpace: "pre-wrap"
        }
    }, {
        Header: "债券代码",
        accessor: "BONDCODE",
        minWidth: 100,
        style: {
            textAlign: "center"
        }
    }, {
        Header: "债券类型",
        accessor: "TYPENAME",
        minWidth: 100,
        style: {
            textAlign: "center"
        }
    }, {
        Header: "发行方式",
        accessor: "ISSUETYPE",
        minWidth: 100,
        style: {
            textAlign: "center"
        }
    }, {
        Header: "发行日期",
        accessor: "ISSUEDATE",
        minWidth: 100,
        style: {
            textAlign: "center"
        }
    }, {
        Header: "发行批次",
        accessor: "BATCHMODE",
        minWidth: 100,
        style: {
            textAlign: "center"
        }
    }, {
        Header: "发行期限",
        id: "BONDTERMID",
        accessor: (d) => FormatTermId(d.BONDTERMID),
        minWidth: 100,
        style: {
            textAlign: "center"
        },
        Footer: (() => "")
    }
    , {
        Header: "债券金额(万元)",
        accessor: "BONDLIMIT",
        minWidth: 100,
        style: {
            textAlign: "right"
        }
    }, {
        Header: "新增额度(万元)",
        accessor: "NEWS",
        minWidth: 100,
        style: {
            textAlign: "right"
        }
    }, {
        Header: "置换额度(万元)",
        accessor: "REPLACEMENT",
        minWidth: 100,
        style: {
            textAlign: "right"
        }
    }, {
        Header: "借新还旧(万元)",
        accessor: "REFUNDING",
        minWidth: 100,
        style: {
            textAlign: "right"
        }
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
        fetch("http://127.0.0.1:8080/bondInfoAction/bondInfoList.do", {
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
                pageSize: data.pageSize,
                total: data.total,
                footer: data.footer
            });
        });
    };

    update = (params) => {
        this.load(Object.assign(__params__, params));
    };

    onPageChange = (currentPage) => {
        const pageInfo = {page: currentPage};
        this.update(pageInfo)
    };
    onPageSizeChange = (currentPage, currentPageSize) => {
        const pageInfo = {page: currentPage, rows: currentPageSize};
        this.update(pageInfo);
    };


    render() {
        return (
            <ReactTable {...this.state}
                        className="-striped -highlight"
                        style={{
                            height: document.body.clientHeight - 2
                        }}
                        onPageChange={this.onPageChange}
                        onPageSizeChange={this.onPageSizeChange}
                        manual
                        noDataText={"无数据"}
                        loadingText={"正在加载..."}
                        TbodyComponent={
                            props => (
                                <div {...props} className={classNames("rt-tbody", props.className || [])}>
                                    <Scrollbar>{props.children}</Scrollbar>
                                </div>
                            )
                        }
                        PaginationComponent={
                            props => {
                                return <Pagination
                                    selectComponentClass={Select}
                                    pageSizeOptions={__pageSize__.Pagination}
                                    showSizeChanger={true}
                                    showQuickJumper={{goButton: <button>确定</button>}}
                                    defaultPageSize={props.pageSize}
                                    defaultCurrent={props.page + 1}
                                    onShowSizeChange={this.onPageSizeChange}
                                    onChange={this.onPageChange}
                                    total={this.state.total}
                                    showTotal={(total, info) => `显示${info[0]}-${info[1]},共${total}条`}
                                />
                            }
                        }
                        TfootComponent={
                            props => {
                                let _original = props.children;
                                let generateFooter = (index) =>
                                    <Tr className={_original.props.className} style={_original.props.style}>
                                        {_original.props.children.map((td, idx) => {
                                            let content = "";
                                            if (this.state.footer && this.state.footer[index][td.key.replace(idx + "-", "")]) {
                                                content = this.state.footer[index][td.key.replace(idx + "-", "")];
                                            }
                                            return <Td key={td.key} className={td.props.className}
                                                       style={td.props.style}>
                                                {content}
                                            </Td>
                                        })}
                                    </Tr>;
                                return (
                                    <div className={"rt-tfoot"} style={props.style}>
                                        {generateFooter(0)}
                                        {generateFooter(1)}
                                    </div>
                                )
                            }
                        }
            >
            </ReactTable>
        );
    }
}

export default App;

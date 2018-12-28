import React, {Component} from 'react';
import Table from 'antd/lib/table';
import queryString from 'query-string';
import './App.css';

const {Column} = Table;

const __params__ = {
    bondCode: "",
    bondName: "",
    issuetype: "",
    issueDate: "",
    bondTermID: "",
    issuebatchid: "",
    logFlag: false
};

class AntdTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pagination: {
                defaultCurrent: 1,
                defaultPageSize: 10,
                showSizeChanger:true,
                showTotal:(total, range) => `显示${range[0]}-${range[1]} 共 ${total} 条记录`,
                showQuickJumper:true,
            }
        };
    }

    componentDidMount() {
        this.load(__params__);
    }

    load = (params = {}) => {
        let that = this;
        this.setState({loading:true});

        const defaultPageSize = {
            page: this.state.pagination.defaultCurrent,
            rows: this.state.pagination.defaultPageSize
        };

        fetch("http://localhost:8080/BondManagerSys/bondInfoAction/bondInfoList.do", {
            mode: "cors",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: queryString.stringify(Object.assign(defaultPageSize,params))
        }).then(res =>
            res.json()
        ).then(data => {
            const pagination = {...this.state.pagination};

            pagination.onChange = (currentPage, pageSize) => {
                let pageInfo = {
                    page:currentPage,
                    rows:pageSize
                };
                that.update(pageInfo);
            };
            pagination.onShowSizeChange = (current, size) =>{
                let pageInfo = {
                    page:current,
                    rows:size
                };
                that.update(pageInfo);
            };
            pagination.total = data.total;
            this.setState({
                data: data,
                loading: false,
                pagination: pagination
            });
        });
    };

    update = (params) => {
        this.load(Object.assign(__params__, params));
    };

    FormatTermId = (data) => data + "年期";

    render() {
        return (
            <Table {...this.state} dataSource={this.state.data.data} rowKey="ID"
                   onHeaderRow={(column, index) => {
                       column[index].align = "center";
                   }}
                   bordered={true}
                   size="small"
                   scroll={{ y: 500}}
            >
                <Column title="债券名称" dataIndex="BONDNAME" key="BONDNAME" width="200px"/>
                <Column title="债券代码" dataIndex="BONDCODE" key="BONDCODE" width="100px"/>
                <Column title="债券类型" dataIndex="TYPENAME" key="TYPENAME" width="100px"/>
                <Column title="发行方式" dataIndex="ISSUETYPE" key="ISSUETYPE" width="100px"/>
                <Column title="发行日期" dataIndex="ISSUEDATE" key="ISSUEDATE" width="100px"/>
                <Column title="发行批次" dataIndex="BATCHMODE" key="BATCHMODE" width="100px"/>
                <Column title="发行期限" dataIndex="BONDTERMID" key="BONDTERMID" width="100px"
                        render={this.FormatTermId}/>
                <Column title="债券金额(万元)" dataIndex="BONDLIMIT" key="BONDLIMIT" align="right" width="100px"/>
                <Column title="新增额度(万元)" dataIndex="NEWS" key="NEWS" align="right" width="100px"/>
                <Column title="置换额度(万元)" dataIndex="REPLACEMENT" key="REPLACEMENT" align="right" width="100px"/>
                <Column title="借新还旧(万元)" dataIndex="REFUNDING" key="REFUNDING" align="right" width="100px"/>
            </Table>
        );
    }
}

export default AntdTable;

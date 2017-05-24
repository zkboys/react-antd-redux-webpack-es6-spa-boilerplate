import Mock from 'mockjs';

const random = Mock.Random;

export function getMerchantsByPageSize(pageSize) {
    const data = [];
    for (let i = 0; i < pageSize; i++) {
        data.push(Mock.mock(
            {
                id: random.guid(),
                taskCode: random.guid(),
                receiptsName: random.cword(5, 17),
                registName: random.cword(5, 17),
                mainManageBusiness: random.cword(5, 7),
                legalPersonName: random.cname(),
                linkmanMobileNo: random.natural(10000000000, 13999999999),
                salesmanName: random.cname(),
                createUser: random.cname(),
                customClassify: random.cname(),
                updateTime: random.date('yyyy-MM-dd hh:mm:ss'),
            }
        ));
    }
    return data;
}

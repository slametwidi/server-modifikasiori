import React from 'react';
import AccountSidebar from '../../components/AccountSidebar';

const MyAccount = () => {
  return (
    <section className="py-10 w-full">
        <div className="container flex gap-5">

            <div className="col1 w-[20%]">
            <AccountSidebar />
            </div>

            <div className="col2 w-[50%]"></div>
        </div>
    </section>
  )
}

export default MyAccount;

"use client";export function LogoutButton(){return <button onClick={async()=>{await fetch('/api/auth/logout',{method:'POST'});location.assign('/admin/login')}}>Выйти</button>}

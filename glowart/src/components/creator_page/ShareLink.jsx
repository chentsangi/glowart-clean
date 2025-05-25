//複製連結
function ShareLink() {
    const copyURL = () => {
        const artURL = window.location.href;

        navigator.clipboard.writeText(artURL)
            .then(() => {
                alert("已複製連結至剪貼簿!👍");
            })
            .catch(err => {
                alert("複製失敗，殘念得很!!! " + err);
            });
    };
    

    return (
        <img
            onClick={copyURL} 
            src="/images/Link.png"
            alt="複製連結"
            style={{ cursor: 'pointer' }} // 添加滑鼠指標樣式
        />
    );
}
export default ShareLink;

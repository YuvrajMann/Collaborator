import React from "react";
import "./MainPlayground.css";
import { Select } from "antd";
const { Option } = Select;
export default function LeftPaneHead(props) {
  return (
    <div className={props.theme=="vs"?"head_h white":(props.theme=="hc-black")?"head_h black":"head_h"}>
      <div id="cmd_pallet">
        Command Pallet - F1
      </div>
      <Select
        showSearch
        style={{ width: 100, fontSize: "13px" }}
        placeholder="Language"
        OptionFilterProp="children"
        onChange={(e)=>{
        
          props.setLanguage(e);
        }}
        filterOption={(input, Option) =>
          Option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        filterSort={(OptionA, OptionB) =>
          OptionA.children
            .toLowerCase()
            .localeCompare(OptionB.children.toLowerCase())
        }
      >
        <Option value="abap">abap</Option>
        <Option value="aes">aes</Option>
        <Option value="apex">apex</Option>
        <Option value="azcli">azcli</Option>
        <Option value={5}>bat</Option>
        <Option value={6}>bicep</Option>
        <Option value="c">c</Option>
        <Option value={8}>cameligo</Option>
        <Option value="clojure">clojure</Option>
        <Option value={10}>coffeescript</Option>
        <Option value="cpp">cpp</Option>
        <Option value="csharp">csharp</Option>
        <Option value={13}>csp</Option>
        <Option value="css">css</Option>
        <Option value="dart">dart</Option>
        <Option value={16}>dockerfile</Option>
        <Option value={17}>ecl</Option>
        <Option value={18}>elixir</Option>
        <Option value={19}>flow9</Option>
        <Option value={20}>go</Option>
        <Option value={21}>graphql</Option>
        <Option value={22}>handlebars</Option>
        <Option value={23}>hcl</Option>
        <Option value="html">html</Option>
        <Option value={25}>ini</Option>
        <Option value="java">java</Option>
        <Option value="javascript">javascript</Option>
        <Option value="json">json</Option>
        <Option value={29}>julia</Option>
        <Option value="kotlin">kotlin</Option>
        <Option value={31}>less</Option>
        <Option value={32}>lexon</Option>
        <Option value={33}>liquid</Option>
        <Option value={34}>lua</Option>
        <Option value={35}>m3</Option>
        <Option value={36}>markdown</Option>
        <Option value={37}>mips</Option>
        <Option value={38}>msdax</Option>
        <Option value="mysql">mysql</Option>
        <Option value={40}>objective-c</Option>
        <Option value={41}>pascal</Option>
        <Option value={42}>pascaligo</Option>
        <Option value={43}>perl</Option>
        <Option value={44}>pgsql</Option>
        <Option value="php">php</Option>
        <Option value={46}>pla</Option>
        <Option value="plaintext">plaintext</Option>
        <Option value={48}>postiats</Option>
        <Option value={49}>powerquery</Option>
        <Option value={50}>powershell</Option>
        <Option value={52}>proto</Option>
        <Option value={53}>pug</Option>
        <Option value="python">python</Option>
        <Option value={55}>qsharp</Option>
        <Option value={56}>r</Option>
        <Option value={57}>razor</Option>
        <Option value={58}>redis</Option>
        <Option value={59}>redshift</Option>
        <Option value={60}>restructuredtext</Option>
        <Option value={61}>ruby</Option>
        <Option value={62}>rust</Option>
        <Option value={63}>sb</Option>
        <Option value={64}>scala</Option>
        <Option value={65}>scheme</Option>
        <Option value="scss">scss</Option>
        <Option value={67}>shell</Option>
        <Option value={68}>sol</Option>
        <Option value={69}>sparql</Option>
        <Option value="sql">sql</Option>
        <Option value={71}>st</Option>
        <Option value={72}>swift</Option>
        <Option value={73}>systemverilog</Option>
        <Option value={74}>tcl</Option>
        <Option value={75}>twig</Option>
        <Option value="typescript">typescript</Option>
        <Option value={77}>vb</Option>
        <Option value={78}>verilog</Option>
        <Option value={79}>xml</Option>
        <Option value="yaml">yaml</Option>
        <Option value={81}>fsharp</Option>

      </Select>
      
      <Select
        style={{ width: 125, fontSize: "13px", marginLeft: "5px" }}
        placeholder="Theme"
        OptionFilterProp="children"
        onChange={(e)=>{
          props.setTheme(e);
        }}
      >
        <Option value="vs">Visual Studio</Option>
        <Option value="vs-dark">Visual Studio Dark</Option>
		    <Option value="hc-black">High Contrast Dark</Option>
      </Select>
    </div>
  );
}

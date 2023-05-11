/*
 Copyright (C) 2019  Nicolas Bertrand

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

browser.contextMenus.create({
        id: "traduire",
        title: "Traducir",
        contexts: ["selection"]
});

browser.runtime.onMessage.addListener(updateMenu);

// Strip any aditional space, word or punctuation from the selection
// return the first word 
function getFirstWord(str) {
        var str_result = str.trim()
        var word = str_result.split(/\s|!|\(|\)|_|,|\.|;|:|'|"/)[0];

        if (word.length > 0) {
                return word;
        } else {
                console.log("[select_trad.js] getFirstWord: empty string");
                return "";
        }
}

function updateMenu(message) {
        var text = getFirstWord(message.selection);
        browser.contextMenus.update("traduire", {
               title: "Traducción: \"" + text + "\""});
        console.log("[select_trad.js] updateMenu: " + text);
        browser.contextMenus.refresh();
}

browser.contextMenus.onClicked.addListener((info, tab) => {
        if (info.menuItemId === "traduire") {
                var text = getFirstWord(info.selectionText);
                console.log("[select_trad.js] onClicked: " + text);
                var wordrefUrl = "http://www.wordreference.com/redirect/translation.aspx?w=" + text + "&dict=enes";
                browser.tabs.create({
                        url: wordrefUrl
                });
        }
})


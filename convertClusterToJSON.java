import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;

class convertClusterToJSON{

    public static void main(String[] args) throws IOException{
        int numberOfClusters = 9; // This needs to be passed into the application at some point
        // ArrayList<Integer> cluster = new ArrayList<Integer>();
        // ArrayList<Integer> nodes = new ArrayList<Integer>();
        //Set<String> actualNodes = new HashSet<>();
        //System.out.print(System.getProperty("user.dir")); //THIS MIGTH COME IN HANDY
        int [][] clusterConnections = new int[numberOfClusters][numberOfClusters];
        ArrayList<ArrayList<Integer>> clusterNodesBelongsTo = new ArrayList<>(1);
        for(int i=0; i < numberOfClusters; i++) {
            clusterNodesBelongsTo.add(new ArrayList());
        } 

        //clusterNodesBelongsTo.get(0).add(2);
        int count = 0;
        BufferedReader reader;
         
		try {
			reader = new BufferedReader(new FileReader
            ("output.csv")); //THIS NEEDS TO BE PASSED IN
            String line = reader.readLine();
            
            while (line != null) {

                String[] values = line.split(",");
                //System.out.println(values.length);

                //System.out.println(values[2]);

                clusterNodesBelongsTo.get(Integer.parseInt(values[2])).add(count);
                // System.out.println();
				// // read next line
                count++;
				line = reader.readLine();
                //System.out.println(line);

			}
			reader.close();
		} catch (IOException e) {
			e.printStackTrace();
            System.out.println("###################################\nChange the file name you are using ADAM\n###################################");
		}


        // int vertexCount2 = clusterNodesBelongsTo.size();
        // for (int i = 0; i < vertexCount2; i++) {
        //     int edgeCount = clusterNodesBelongsTo.get(i).size();
        //     for (int j = 0; j < edgeCount; j++) {
        //         Integer startVertex = i;
        //         Integer endVertex = clusterNodesBelongsTo.get(i).get(j);
        //         System.out.printf("Vertex %d is connected to vertex %d%n", startVertex, endVertex);
        //     }
        // }

// Now i need to read the original file again to see how many nodes in different clusters connect with one another

    try {
        reader = new BufferedReader(new FileReader
        ("network_to_share_200.txt")); //THIS NEEDS TO BE PASSED IN
        String line = reader.readLine();
        line = reader.readLine(); // Skipping first line that says the number of nodes

        while (line != null) {

            String[] values = line.split("\t");
            //System.out.println(values[0] + "," + values[1]);
            //FIND THE CLUSTER THE FIRST NODE IS IN
            int clusterNodeIsIn = 0;
            int clusterOfOtherNode = 0;

            outerloop:
            for(int i=0; i < clusterNodesBelongsTo.size(); i++){
                int edgeCount = clusterNodesBelongsTo.get(i).size();
                for (int j = 0; j < edgeCount; j++) {
                    //clusterNodeIsIn = ((clusterNodesBelongsTo.get(i).get(j) == values[0])? values[0]: null);
                    if(clusterNodesBelongsTo.get(i).get(j) == Integer.parseInt(values[0])){
                        clusterNodeIsIn = i;
                        break outerloop;
                    }
                }
            }

            outerloop:
            for(int i=0; i < clusterNodesBelongsTo.size(); i++){
                int edgeCount = clusterNodesBelongsTo.get(i).size();
                for (int j = 0; j < edgeCount; j++) {
                    //clusterNodeIsIn = ((clusterNodesBelongsTo.get(i).get(j) == values[0])? values[0]: null);
                    if(clusterNodesBelongsTo.get(i).get(j) == Integer.parseInt(values[1])){
                        clusterOfOtherNode = i;
                        //System.out.println(i + "   " + clusterNodesBelongsTo.get(i).get(j));
                        break outerloop;
                    }
                    // if(clusterNodesBelongsTo.get(i).get(j) > Integer.parseInt(values[1])){
                    //     break;
                    // }
                }
            }
            //System.out.print(clusterNodeIsIn + "\t"+clusterOfOtherNode);
            clusterConnections[clusterNodeIsIn][clusterOfOtherNode]++;
            clusterConnections[clusterOfOtherNode][clusterNodeIsIn]++;
            
            // System.out.println();
            // // read next line
            line = reader.readLine();
            //System.out.println(line);

        }
        reader.close();
    } catch (IOException e) {
        e.printStackTrace();
    }


    for (int i = 0; i <clusterConnections.length ; i++) {
        int edgeCount = clusterConnections[i].length;
        for (int j = 0; j < edgeCount; j++) {
            System.out.printf("| %d | ", clusterConnections[i][j]);
        }
        System.out.println();
    }

    // Creating a new file that converts the one supplied into a JSON file.
    String filePath = ".\\JSON200\\";
    String fileName = "200Cluster";
    File f = new File(filePath + fileName + ".JSON");

    if(!f.exists()){
        f.getParentFile().mkdirs(); 
        try {
            f.createNewFile();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }else{
        int i = 0;
        do{
            f = new File(filePath + fileName + "_"+ i +".JSON");
            i++;
        }while(f.exists());
        f.getParentFile().mkdirs(); 
        try {
            f.createNewFile();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    System.out.print("File created: " + f+"\n");


    FileWriter fw = null;
    try {
        fw = new FileWriter(f, true);
    } catch (IOException ex) {

    }

    //int counter = 0;
    boolean writingToFile = true;
    //Iterator itr = actualNodes.iterator();
    if (fw != null) {
        while (writingToFile) { //same as while(runTrue == true)

            try {
                fw.write("{\n");
                fw.write("\"nodes\": [\n");
                for(int i=0; i < numberOfClusters; i++ ) {
                    //Object element = itr.next();
                    fw.write("\t{ \"name\": \"" +  i + "\"}");
                    if(i < numberOfClusters-1){
                        fw.write(",\n");
                    }
                }
                fw.write("\n],\n");
                fw.write("\"nodeInClusters\": [\n");

        // int vertexCount = clusterNodesBelongsTo.size();
        // for (int i = 0; i < vertexCount; i++) {
        //     int edgeCount = clusterNodesBelongsTo.get(i).size();
        //     for (int j = 0; j < edgeCount; j++) {
        //         Integer startVertex = i;
        //         Integer endVertex = clusterNodesBelongsTo.get(i).get(j);
        //         System.out.printf("Vertex %d is connected to vertex %d%n", startVertex, endVertex);
        //     }
        // }

                int vertexCount = clusterNodesBelongsTo.size();
                for (int i = 0; i < vertexCount; i++) {
                    int edgeCount = clusterNodesBelongsTo.get(i).size();
                    fw.write("\t{ \""+i+"\": ["+clusterNodesBelongsTo.get(i).get(0));
                    for(int j = 1; j < edgeCount; j++){
                        fw.write(","+clusterNodesBelongsTo.get(i).get(j)+"");
                    }
                    fw.write((i == vertexCount-1) ? "]}\n" : "]},\n");
                }


                fw.write("\n],\n\"links\": [\n");
                int arbVal = 30;
                Boolean flag = false;
                for(int i=1 ; i < numberOfClusters; i++){ //9
                    for(int j=0; j<i ;j++){
                        if(clusterConnections[i][j] >= arbVal){
                            if(!flag) flag = true;
                            else fw.write(",\n");
                            fw.write("\t{ \"source\": \""+i+"\",\"target\": \""+j+"\"}");
                        }
                    }
                }

                fw.write("\n]}");

            

            } catch (IOException e) {
                break;
            }
            if(true){
                fw.flush();
                fw.close();
                writingToFile = false;
                break;
            }
        }
    }

    }

}